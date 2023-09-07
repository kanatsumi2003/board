from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from . import constants

class LoginForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "POST"
        self.helper.add_input(Submit('submit', 'Login'))
        
    username = forms.CharField(label="Username", max_length=1000, required=True)
    password = forms.CharField(label="Password", max_length=1000, required=True, widget=forms.PasswordInput())

class MqttForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "POST"
        
    host = forms.CharField(label="Host", max_length=1000, required=True)
    port = forms.IntegerField(label="Port", required=True)
    username = forms.CharField(label="Username", max_length=1000, required=True)
    password = forms.CharField(label="Password", max_length=1000, required=True, widget=forms.PasswordInput())
    secret_key = forms.CharField(label="Secret Key", max_length=1000, required=True, widget=forms.PasswordInput())
    locker_code = forms.CharField(label="Locker code", max_length=1000, required=True)
