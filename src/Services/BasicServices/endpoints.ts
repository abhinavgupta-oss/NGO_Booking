export const API = {
    BASE_URL: {
        DEV_URL: "https://dev.sanatancloud.org/api",
    },
    AUTH_URL: {
        APP_BUILD: "/v1/appbuilddetail/1",
        FORGET_PASSWORD: "/v1/forgetpassword",
        FORGET_VERIFY_OTP: "/v1/forgetpassword/validate/otp",
        FORGET_RESEND_OTP: "/v1/resendotp",
        FORGET_RESET_PASS: "/v1/resetpassword",
        DEVOTEE_LOGIN: "/v1/devotee/login",
        DEVOTEE_LOGIN_WITHPASS: "/v1/app/login",
        DEVOTEE_SEND_OTP: "/v1/devotee/sendotp",
        DEVOTEE_REGISTER: "/v1/app/devotee/registration",
        MY_PROFILE: "/v1/user/profile",
        UPDATE_PROFILE: (id: string) => `/v1/bo/devotee/${id}`
    },
    DEVOTEE_INFO: {
        DEVOTEE_MYDONATION: "/v1/bo/donation/filter"
    },
    EVENT: {
        EVENT_LIST: "/v1/event/search",
        LIVE_EVENT: "/v1/ongoing/events",
        DONATION_INVOICE: (id: string) => `/v1/bo/donation/receipt/${id}`,
        EVENT_DETAILS: (id: string) => `/v1/event/${id}`,
    },
    DONATION: {
        DONATION_LIST: "/v1/seva/search",
        DONATION_PAYMENT: "/v1/devotee/registration",
        DONATION_VERIFY: "/v1/payment/razorpay/verify",
        DEVOTEE_DETAILS_UPDATE: "/v1/user/update",
        DONATION_INVOICE: (id: string) => `/v1/bo/donation/receipt/${id}`,
    },
    UTILS: {
        COUNTRY: "/v1/country",
        STATE: "/v1/state",
        CITY: "/v1/city",
        LOG_OUT: "/v1/logout",
    },
    ROOMS: {
        List: '/v1/room/search',
        DETAILS: (id: string) => `/v1/bo/room/${id}`,
        BOOKING: "/v1/bo/room/booking",
        PAYMENT_BOOKING: "/v1/payment/roombook/verify",
        TYPE: '/v1/bo/room/type',
        MY_BOOKINGS: "/v1/bo/room/booking/filter",
        MY_BOOKINGS_DETAILS: (id: string) => `/v1/bo/room/booking/${id}`,
        PAYMENT_TRANSACTION: "/v1/bo/room/booking/transactions",
        PAYMENT_INVOICE: (id: string) => `/v1/bo/room/booking/receipt/${id}`,
        BALANCE_PAYMENT: "/v1/bo/room/booking/payment",
    }
}