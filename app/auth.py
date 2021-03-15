
class Auth:
   
    def __init__(self,users_tokens=dict()):
       self.users_tokens=users_tokens

    def add_user_token(self,username):
       from uuid import uuid4
       token=uuid4()
       self.users_tokens.update({
           username:token
       })
       return token
    
    def auth_token(self, request):
        import json
        from uuid import UUID
        data=json.loads(request.body)
        username=data.get('username')
        token=data.get('token')
        # print('token:',token,'  username:',username)
        if  not(request.method == "POST") and not(username) and not(token) :
            return False

        # print('first chk passed')
        # print(self.users_tokens.items())
        # print('--username--',username)
        # print('--token--',token)
        result = (username,UUID(token)) in self.users_tokens.items()
        # print(result)
        if not result:
            return False
        
        return request
    
    def delete_user_token(self,username):
        try:
            return self.users_tokens.pop(username)
        except KeyError:
            return False

    def get_all(self):
        return self.users_tokens