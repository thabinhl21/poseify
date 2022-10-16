from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()

ACC_SID = os.getenv('ACCOUNT_SID')
TOKEN = os.getenv('AUTH_TOKEN')
TWILIO_NUM = os.getenv('TWILIO_NUM')

class SendMsg():

    def __init__(self):
        pass

    def send_sms(self, number):

        client = Client(ACC_SID, TOKEN)

        message = client.messages.create(
            body="Welcome to Poseify!",
            from_=TWILIO_NUM,
            to=number
        )

        print(message.body)