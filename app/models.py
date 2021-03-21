from uuid import uuid4
from django.db import models

def overwrite(instance,filename):
    
    newfile=f'student_{instance.id}/image.{filename.split(".")[-1]}'
    return newfile
# Create your models here.
class Student(models.Model):
   
    
    id = models.UUIDField(primary_key=True,default=uuid4,editable=True)
    name=models.CharField(max_length=200,null=False,blank=False)
    fname=models.CharField(max_length=200,null=False,blank=False)
    last_name=models.CharField(max_length=200,null=False,blank=False)
    date_of_birth=models.DateField(auto_now=False)
    email=models.EmailField(max_length=254,null=False,blank=False,unique=True)
    image=models.ImageField(upload_to=overwrite,blank=True )
    created_at=models.DateTimeField(auto_now=True)

    def delete(self):
        img=self.image.name
        self.image.storage.delete(img)
        self.image.storage.delete(img.split('/')[0])
        super().delete()


    class Meta:
        ordering=['created_at']


class Token(models.Model):
    token=models.CharField(max_length=128)
    expire_date=models.DateTimeField()
    username=models.CharField(max_length=100,null=False,unique=True)
    password=models.CharField(max_length=100,null=False)