import express from 'express';
import conn from '../ConnDBFile/dbConn.js';
const router = express.Router();

router.get('/Home', (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({message:'Failed to Reset, Try Again!'});
            return;
        }
        const HomeInfo = 'SELECT * from Domain';
        connection.query(HomeInfo, (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({message:'Failed to Load Home Data, Try Again!'});
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
router.post('/HomeDetailData', (req, res) => {
    const {domainid} = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({message:'Failed to Reset, Try Again!'});
            return;
        }
        const UserProfileInfo = 'SELECT * FROM UserInfo WHERE DomainId = ? ORDER BY AvgRating DESC';
        connection.query(UserProfileInfo, [domainid],(checkErr, results) => {
            if (checkErr) {
                res.status(500).send({message:'Failed to Load Home Data, Try Again!'});
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

router.get('/', (req, res) => {
    res.send("working home");
});

export default router;
