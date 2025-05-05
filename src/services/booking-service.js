const axios=require('axios');

const {BookingRepository}=require('../repository/index');
const {FLIGHT_SERVICE_PATH}=require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService{
    constructor(){
        this.bookingRepository=new BookingRepository();
    }

    async createBooking(data){
        try{
            console.log("in service layer");
            const flightId=data.flightId;
            let getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const flight=await axios.get(getFlightRequestURL);
            const flightData= flight.data.data;
            if(data.noOfSeats>flightData.totalSeats){
                return new ServiceError('Something went wrong in the booking process','Insufficient seats in the flights');
            }
            const totalCost=flightData.price*data.noOfSeats;

            const bookingPayLoad={...data,totalCost};

            console.log(bookingPayLoad);

            const booking=await this.bookingRepository.create(bookingPayLoad);

            

            const updateFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats-booking.noOfSeats});
            const finalBooking=await this.bookingRepository.update(booking.id,{status:"Booked"});
            return finalBooking;

        }catch(error){
            console.log(error); 
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }
}
module.exports=BookingService;