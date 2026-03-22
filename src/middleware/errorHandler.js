import { HttpError } from "http-errors";
export const errorHandler = (error, req, res, next) => {
    console.error("Error:", error)

    if (error instanceof HttpError) {
        return res.status(error.status).json({
            message: error.message || error.name
        })
    }

    res.status(500).json({
        message: 'Something went wrong. Please try again later.'
    })

}
