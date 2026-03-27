import { asyncHandler } from "../utils/asyncHandler.js";


const reqisterUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "chai or code"
    })
})


export {reqisterUser}