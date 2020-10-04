module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    try {
        if (typeof (err) === 'string') {

            console.log(err);
            return res.status(704).json({
                message: err.message
            });
        }

        if (err.name === 'ValidationError') {

            console.log(err);
            return res.status(400).json({
                message: err.message
            });
        }

        if (err.name === 'UnauthorizedError') {

            console.log(err);
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        if (err.code === 11000) {
            console.log(err);
            return res.status(704).json({
                message: 'Account Aldready Exists'
            });
        }
        console.log(err);


        return res.status(401).json({
            message: err.message
        });
    } catch (err) {
        console.log(err)
    }
}