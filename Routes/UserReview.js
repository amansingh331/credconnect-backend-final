import express from 'express';
import conn from '../ConnDBFile/dbConn.js';
const router = express.Router();


router.post('/UserReview', (req, res) => {
    const {userid} = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({message:'Failed to Reset, Try Again!'});
            return;
        }
        const userinfo = 'SELECT r.UserIdFrom, u.Fname, u.Lname, r.ReviewMsg, r.DateTime, r.Rating, u.ProfilePic FROM Review r JOIN UserInfo u ON r.UserIdFrom = u.UserId WHERE r.UserIdTo = ?';
        connection.query(userinfo, [userid], (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({message:'Failed to Load Review, Try Again!'});
                connection.release();
                return;
            }
            if (results.length > 0) {
                res.json(results);
                connection.release();
            } else {
                res.send({message:'Failed to Load, Try Again!'});
                connection.release();
            }
        });
    });
});



export default router;
