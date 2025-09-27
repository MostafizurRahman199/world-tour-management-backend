import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DivisionRouter } from "../modules/division/division.route";
import { TourRouter } from "../modules/tour/tour.route";
import { TourTypeRouter } from "../modules/TourType/tourType.route";
import { BookingRouter } from "../modules/booking/booking.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { otpRouter } from "../modules/otp/otp.route";
import { statsRouter } from "../modules/stats/stats.route";



export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRouter
    },
    {
        path: "/auth",
        route: AuthRouter
    },
    {
        path: "/division",
        route: DivisionRouter
    },
    {
        path: "/tour",
        route: TourRouter
    },
    {
        path:"/tour-type",
        route:TourTypeRouter
    },
    {
        path:"/booking",
        route:BookingRouter
    },
    {
        path:"/payment",
        route:PaymentRouter
    },
    {
        path:"/otp",
        route:otpRouter
    },
    {
        path:"/stats",
        route:statsRouter,
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;