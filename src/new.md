// export const registerController = asyncHandler(async (req: Request, res: Response) => {

//     const body = registerSchema.parse(req.body)

//    const user = await registerService(body)

//     const userId = user._id as string

//     return setJwtAuthCookie({
//         res,
//         userId
//     }).status(HTTPSTATUS.CREATED).json({
//          message: 'User created successfully!',
//          user
//     })

// })
