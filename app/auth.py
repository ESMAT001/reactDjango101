from uuid import uuid4
from datetime import datetime ,timedelta ,timezone
from hashlib import sha512
import json

class Auth:
    salt_value='hello'
    def __init__(self,token_model):
       self.token_model=token_model

    def date_from_timestamp(self,ms):
        return datetime.fromtimestamp(float(ms)/1000.0)


    def timestamp(self,date_time):
        return date_time.replace(tzinfo=timezone.utc).timestamp() * 1000

    def create_token(self,username):
        token=uuid4()
        expire_date=datetime.now()+timedelta(days=1)
        
        db_user=self.token_model.objects.filter(username=username)

        if db_user.exists():
            db_user.expire_date=expire_date
            db_user.token=sha512(str(token).encode("utf-8")).hexdigest()
            # db_user.save()
        else:              
            self.token_model.objects.create(
                username=username,
                token=sha512(str(token).encode("utf-8")).hexdigest(),
                expire_date=expire_date
            )
        expire_date=self.timestamp(expire_date)
        return f'{token}|{expire_date}'
    

    def renew_token(self,request):
        data = self.auth_token_helper(request)
        if not data:
            return False
        return self.create_token(data[0].username)


    def auth_token_helper(self,request):
        data=json.loads(request.body)
        username=data.get('username')
        token_data=data.get('token')
        # print('token:',token,'  username:',username)
        if  not(request.method == "POST") and not(username) and not(token) :
            return False
        
        token=sha512(str(token_data.split('|')[0]).encode('utf-8')).hexdigest()

        db_data=self.token_model.objects.filter(username=username, token=token )

        if not db_data.exists():
            return False

        return db_data , token_data.split('|')[1]


    def auth_token(self, request):
        data = self.auth_token_helper(request)
        if not data:
            return False
        db_data , token_timestamp = data
        expire_date=self.date_from_timestamp(token_timestamp)
        if db_data.expire_date < expire_date:
            return False
        return request

    def delete_user_token(self,username):
        token=self.token_model.objects.filter(username=username)
        if not token.exists():
            return False
        token.delete()
        return True

    