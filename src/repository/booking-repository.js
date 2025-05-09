const {StatusCodes}=require('http-status-codes');

const {Booking}=require('../models/index');
const{AppError,ValidationError}=require('../utils/errors/index');

class BookingRepository{
    async create(data){
        try{
            console.log("in repo layer");
            const booking=await Booking.create(data);
            console.log("in repo layer after creating");
            return booking;
        }catch(error){
            console.log(error);
            if(error.name=='SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository Error',
                'Cannot create Booking',
                'There was some issue creating booking,please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async update(bookingId,data){
        try{
            const booking=await Booking.findByPk(bookingId);
            if(data.status){
                booking.status=data.status;
            }
            await booking.save();
            return booking;
        }catch(error){
            throw new AppError(
                'RepositoryError',
                'Cannot Update Booking',
                'There was some issue updating the booking,please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            
            )
        }
    }
}
module.exports=BookingRepository;


