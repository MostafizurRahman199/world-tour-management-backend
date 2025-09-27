import { User } from "../user/user.model";
import { BookingModel } from "../booking/booking.model";
import { PaymentModel } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { Division } from "../division/division.model";

export class StatsService {

  static async getDashboardStats() {



  // ===== User Stats =====
    const userStats = await User.aggregate([
    {
        $facet: {
        totalUsers: [{ $count: "count" }],

        byRole: [
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ],

        byActiveStatus: [
            { $group: { _id: "$isActive", count: { $sum: 1 } } },
        ],

        byVerifiedStatus: [
            { $group: { _id: "$isVerified", count: { $sum: 1 } } },
        ],

        byDeletedStatus: [
            { $group: { _id: "$isDeleted", count: { $sum: 1 } } },
        ],

        last7Days: [
            {
            $match: {
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
            },
            { $count: "count" },
        ],

        last30Days: [
            {
            $match: {
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
            },
            { $count: "count" },
        ],
        },
    },
    ]);




// ===== Booking Stats =====
  const bookingStats = await BookingModel.aggregate([
    {
      $facet: {
        // ✅ Total bookings
        totalBookings: [{ $count: "count" }],

        // ✅ Bookings grouped by status
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],

        // ✅ Total guests across all bookings
        totalGuests: [
          { $group: { _id: null, totalGuests: { $sum: "$guestCount" } } },
        ],

        // ✅ Average guest count per booking
        averageGuestCountPerBooking: [
          {
            $group: {
              _id: null,
              avgGuests: { $avg: "$guestCount" },
            },
          },
          { $project: { _id: 0, avgGuests: 1 } },
        ],

        // ✅ Monthly bookings (by month of createdAt)
        monthlyBookings: [
          {
            $group: {
              _id: { $month: "$createdAt" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id": 1 } },
        ],

        // ✅ Per tour bookings
        perTourBookings: [
          {
            $lookup: {
              from: "tours",
              localField: "tour",
              foreignField: "_id",
              as: "tourInfo",
            },
          },
          { $unwind: "$tourInfo" },
          {
            $group: {
              _id: "$tourInfo._id",
              tourTitle: { $first: "$tourInfo.title" },
              slug: { $first: "$tourInfo.slug" },
              bookingCount: { $sum: 1 },
              totalGuests: { $sum: "$guestCount" },
            },
          },
          { $sort: { bookingCount: -1 } },
        ],

        // ✅ Last 7 days bookings
        lastSevenDaysBooking: [
          {
            $match: {
              createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
            },
          },
          { $count: "count" },
        ],

        // ✅ Last 30 days bookings
        lastThirtyDaysBooking: [
          {
            $match: {
              createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
            },
          },
          { $count: "count" },
        ],

        // ✅ Unique user bookings
        uniqueUserBookings: [
          {
            $group: {
              _id: "$user",
            },
          },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalBookings: { $arrayElemAt: ["$totalBookings.count", 0] },
        byStatus: 1,
        totalGuests: { $arrayElemAt: ["$totalGuests.totalGuests", 0] },
        averageGuestCountPerBooking: { $arrayElemAt: ["$averageGuestCountPerBooking.avgGuests", 0] },
        monthlyBookings: 1,
        perTourBookings: 1,
        lastSevenDaysBooking: { $arrayElemAt: ["$lastSevenDaysBooking.count", 0] },
        lastThirtyDaysBooking: { $arrayElemAt: ["$lastThirtyDaysBooking.count", 0] },
        uniqueUserBookings: { $arrayElemAt: ["$uniqueUserBookings.count", 0] },
      },
    },
  ]);






    // ===== Payment Stats =====
    const paymentStats = await PaymentModel.aggregate([
      {
        $facet: {
          
          
          // ✅ Total revenue (only PAID)
          totalRevenue: [
            { $match: { status: "PAID" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],


          // ✅ Payments grouped by status
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],


          // ✅ Monthly revenue
          monthlyRevenue: [
            { $match: { status: "PAID" } },
            {
              $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: "$amount" },
              },
            },
            { $sort: { "_id": 1 } },
          ],


          // ✅ Average payment amount (only PAID)
          averagePayment: [
            { $match: { status: "PAID" } },
            { $group: { _id: null, averageAmount: { $avg: "$amount" } } },
          ],
          
        },
      },
    ]);




// ===== Tour Stats =====
  const tourStats = await Tour.aggregate([
    {
      $facet: {
        totalTours: [{ $count: "count" }],

        avgTourCost: [
          {
            $group: {
              _id: null,
              avgCostFrom: { $avg: "$costFrom" },
            },
          },
          { $project: { _id: 0 } },
        ],

        byDivision: [
          {
            $lookup: {
              from: "divisions",
              localField: "division",
              foreignField: "_id",
              as: "divisionInfo",
            },
          },
          { $unwind: "$divisionInfo" },
          {
            $group: {
              _id: "$divisionInfo._id",
              name: { $first: "$divisionInfo.name" },
              count: { $sum: 1 },
            },
          },
        ],

        byType: [
          {
            $lookup: {
              from: "tourtypes",
              localField: "tourType",
              foreignField: "_id",
              as: "tourTypeInfo",
            },
          },
          { $unwind: "$tourTypeInfo" },
          {
            $group: {
              _id: "$tourTypeInfo._id",
              name: { $first: "$tourTypeInfo.name" },
              count: { $sum: 1 },
            },
          },
        ],

        upcoming: [
          { $match: { startDate: { $gte: new Date() } } },
          { $count: "count" },
        ],

        past: [
          { $match: { endDate: { $lt: new Date() } } },
          { $count: "count" },
        ],

        // ✅ Highest Booking Tour
        totalHighestBookingTour: [
          {
            $lookup: {
              from: "bookings",            // collection name
              localField: "_id",           // tour._id
              foreignField: "tour",        // booking.tour
              as: "bookings",
            },
          },
          {
            $addFields: {
              bookingCount: { $size: "$bookings" },
            },
          },
          { $sort: { bookingCount: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              title: 1,
              slug:1,
              bookingCount: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        totalTours: { $arrayElemAt: ["$totalTours.count", 0] },
        avgTourCost: { $arrayElemAt: ["$avgTourCost.avgCostFrom", 0] },
        byDivision: 1,
        byType: 1,
        upcoming: { $arrayElemAt: ["$upcoming.count", 0] },
        past: { $arrayElemAt: ["$past.count", 0] },
        totalHighestBookingTour: { $arrayElemAt: ["$totalHighestBookingTour", 0] }, // ✅
      },
    },
  ]);




    // ===== Division Stats =====
    const divisionStats = await Division.aggregate([
      {
        $lookup: {
          from: "tours",
          localField: "_id",
          foreignField: "division",
          as: "tours",
        },
      },
      {
        $project: {
          name: 1,
          tourCount: { $size: "$tours" },
        },
      },
      { $sort: { tourCount: -1 } },
    ]);

    return {
      users: userStats[0],
      bookings: bookingStats[0],
      payments: paymentStats[0],
      tours: tourStats[0],
      divisions: divisionStats,
    };
  }
}
