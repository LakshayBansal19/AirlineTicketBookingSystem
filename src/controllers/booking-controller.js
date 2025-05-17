const { StatusCodes } = require('http-status-codes');
const {BookingService}=require('../services');

const bookingService=new BookingService();

const {createChannel,publishMessage}=require('../utils/messageQueue');
const {REMINDER_BINDING_KEY}=require('../config/serverConfig');
class BookingController{

    // constructor(){
    // }

    async sendMessageToQueue(req,res){
        const channel=await createChannel();
        const payload={
            data:{
                subject:"this is a noti from queue",
                content:"some queue will subscribe this",
                recepientEmail:'',//add email,
                notificationTime:' 2025-05-17 15:19:00'
            },
            service:'CREATE_TICKET'
        }
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:'successfully published the event'
        });
    }

    async create (req,res){
        try{
            const response=await bookingService.createBooking(req.body);
            console.log("hello");
            return res.status(StatusCodes.OK).json({
                message:'Successfully completed booking',
                success:true,
                err:{},
                data:response
            })
        }catch(error){
            return res.status(error.statusCode).json({
                message:error.message,
                success:false,
                err:error.explanation,
                data:{}
            });
        }
    }
}

module.exports=BookingController