import express from 'express';
import conn from '../ConnDBFile/dbConn.js';
const router = express.Router();

router.post('/Register', (req, res) => {
    const { Fname, Lname, Email, MobileNumber, Password, Role, IpAddress} = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({status: 3, message:"Failed to Connect, Try Again!"});
            return;
        }
        const checkEmailQuery = 'SELECT * FROM UserInfo WHERE Email = ?';
        connection.query(checkEmailQuery, [Email], (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({status:3, message:"Failed to Register1, Try Again!"});
                connection.release();
                return;
            }
            if (results.length > 0) {
                res.status(400).send({status:2, message:"User already exists!"});
                connection.release();
            } else {
                const insertQuery = 'INSERT INTO UserInfo (Fname, Lname, Email, MobileNumber, Password, Role, IpAddress) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const values = [Fname, Lname, Email, MobileNumber, Password, Role, IpAddress];
                connection.query(insertQuery, values, (insertErr, insertResults) => {
                    if (insertErr) {
                        res.status(500).send({status:3, message:"Failed to Register, Try Again!"});
                    } else {
                        res.status(200).send({status:1, message: "Registered successfully!"});
                    }
                    connection.release();
                });
            }
        });
    });
});

router.post('/Login', (req, res) => {
    const {Email, Password} = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({status:3, message:'Failed to Login, Try Again!'});
            return;
        }
        const checkEmailQuery = 'SELECT * FROM UserInfo WHERE Email = ?';
        connection.query(checkEmailQuery, [Email], (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({status:3, message:'Failed to Login, Try Again!'});
                connection.release();
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                if (user.Password === Password) {
                    res.send({status:1, data:{userid:user.UserId}, message:"Login successful!"});
                } else {
                    res.status(401).send({status:2, message:'Incorrect Username and Password!'});
                }
                connection.release();
            } else {
                res.send({status:2, message:'Incorrect Username and Password!'});
                connection.release();
            }
        });
    });
});
router.post('/Forget', (req, res) => {
    const {Email} = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({status:3, message:'Failed to Reset, Try Again!'});
            return;
        }
        const checkEmail = 'SELECT * FROM UserInfo WHERE Email = ?';
        connection.query(checkEmail, [Email], (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({status:3, message:'Failed to Reset, Try Again!'});
                connection.release();
                return;
            }
            if (results.length > 0) {
                const otp = Math.floor(Math.random() * (100000 - 999999 + 1)) + 999999;
                const updateOtpQuery = 'UPDATE UserInfo SET Otp = ? WHERE Email = ?';
                const values = [otp, Email];
                connection.query(updateOtpQuery, values, (updateErr, updateResults) => {
                    if (updateErr) {
                        res.status(500).send({status:3, message:'Failed to Send Otp, Try Again!'});
                    } else {
                        res.send({status:1, message:'OTP sent successfully!'});
                    }
                    connection.release();
                });
            } else {
                res.send({status:2, message:'User Not Found!'});
                connection.release();
            }
        });
    });
});


router.post('/UserInfo', (req, res) => {
    const { userid } = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({ message: 'Failed to Reset, Try Again!' });
            return;
        }
        const DomainListQuery = 'SELECT * FROM Domain';
        connection.query(DomainListQuery, (checkErr, DomainList) => {
            if (checkErr) {
                res.status(500).send({ message: 'Failed to Load, Try Again!' });
                connection.release();
                return;
            }
            if (DomainList.length > 0) {
                const userinfo = 'SELECT * FROM UserInfo WHERE UserId = ?';
                connection.query(userinfo, [userid], (checkErr, results) => {
                    if (checkErr) {
                        res.status(500).send({ message: 'Failed to Reset, Try Again!' });
                        connection.release();
                        return;
                    }
                    if (results.length > 0) {
                        const user = results[0];
                        const sendData = {
                            UserId: user.UserId,
                            Fname: user.Fname,
                            Lname: user.Lname,
                            Position: user.Position || '',
                            Domain: {
                                DomainSaveId: user.DomainId,
                                DomainSaveName: '',
                                DomainList: DomainList,
                            },
                            Experience: user.Experience || 0,
                            CurrentCompany: user.CurrentCompany || '',
                            Bio: user.Bio || '',
                            Dob: user.Dob,
                            Email: user.Email,
                            MobileNumber: user.MobileNumber,
                            ProfilePic: user.ProfilePic,
                            Description: user.Description || '',
                            AvgRating: user.AvgRating || 0,
                            NoOfReview: user.NoOfReview || 0,
                            Location: user.Location || '',
                            CallPrice: user.CallPrice || 0,
                            ChatPrice: user.ChatPrice || 0,
                            VideoPrice: user.VideoPrice || 0,
                            DateOfJoined: user.DateTime,
                            Linkedin: user.Linkedin,
                            Twitter: user.Twitter,
                            Facebook: user.Facebook,
                            Youtube: user.Youtube,
                            Instagram: user.Instagram
                        };
                        res.json(sendData);
                        connection.release();
                    } else {
                        res.send({ message: 'Failed to Load, Try Again!' });
                        connection.release();
                    }
                });
            } else {

            }
        });

    });
});


router.post('/UpdateUserInfo', (req, res) => {
    const data = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({message:'Failed to Reset, Try Again!'});
            return;
        }
        const updateUserInfoQuery = 'UPDATE UserInfo SET Fname = ?, Lname = ?, Position = ?, Experience = ?, CurrentCompany = ?, Location = ?, Bio = ?, Email = ?, MobileNumber = ?, CallPrice = ?, VideoPrice = ?, ChatPrice = ?, ProfilePic = ?, DomainId = ? WHERE UserId = ?';
        const values = [data.Fname, data.Lname, data.Position, data.Experience, data.CurrentCompany, data.Location, data.Bio, data.Email, data.MobileNumber, data.CallPrice, data.VideoPrice, data.ChatPrice, data.ProfilePic, data.DomainId, data.userid];
        connection.query(updateUserInfoQuery, values, (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error executing query:', updateErr);
                res.send({status:0, msg:'Failed to Send Otp, Try Again!'});
            } else {
                res.send({status:1, msg:'OTP sent successfully!'});
            }
            connection.release();
        });
    });
});



router.post('/SocialLink', (req, res) => {
    const { userid } = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({ message: 'Failed to Load, Try Again!' });
            return;
        }
        const userinfo = 'SELECT * FROM UserInfo WHERE UserId = ?';
        connection.query(userinfo, [userid], (checkErr, results) => {
            if (checkErr) {
                res.status(500).send({ message: 'Failed to Reset, Try Again!' });
                connection.release();
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                const sendData = {
                    UserId: user.UserId,
                    Linkedin: user.Linkedin,
                    Twitter: user.Twitter,
                    Facebook: user.Facebook,
                    Youtube: user.Youtube,
                    Instagram: user.Instagram
                };
                res.json(sendData);
                connection.release();
            } else {
                res.send({ message: 'Failed to Load, Try Again!' });
                connection.release();
            }
        });
    });
});

router.post('/UpdateSocialLink', (req, res) => {
    const data = req.body;
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({message:'Failed to Update, Try Again!'});
            return;
        }
        const updateUserInfoQuery = 'UPDATE UserInfo SET Linkedin = ?, Instagram = ?, Youtube = ?, Twitter = ?, Facebook = ? WHERE UserId = ?';
        const values = [data.Linkedin, data.Instagram, data.Youtube, data.Twitter, data.Facebook, data.userid];
        connection.query(updateUserInfoQuery, values, (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error executing query:', updateErr);
                res.send({status:0, msg:'Failed to Update, Try Again!'});
            } else {
                res.send({status:1, msg:'Update successfully!'});
            }
            connection.release();
        });
    });
});

router.get('/', (req, res) => {
    conn.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(500).send('Error connecting to database');
            return;
        }
        connection.release();
        res.send("user working perfectly!");
    });
});

export default router;
