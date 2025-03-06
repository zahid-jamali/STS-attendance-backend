const Attendance = require("../models/attendance");
const User = require("../models/user.js");
const { makeMyWork } = require("./worksControllers.js");
const { submitGoal} = require("./goalsControllers.js") ;
const Holidays = require("../models/holidays");
const Leaves = require("../models/leaves")






const adminCreatesAttendance = async (req, res) => {
    try {
        const { userId, date, entryTime, exitTime } = req.body;


        const formattedDate = new Date(date).setHours(0, 0, 0, 0);
        const newAttendance = new Attendance({
            user: userId,
            date: formattedDate,
            entryTime: new Date(entryTime),
            exitTime: exitTime ? new Date(exitTime) : null,
            workHours: exitTime ? (new Date(exitTime) - new Date(entryTime)) / (1000 * 60 * 60) : 0
        });

        await newAttendance.save();
        return res.status(201).json({ message: "Attendance added successfully"});
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};








const getUserAttendance = async (req, res, next) => {
    console.log("Request received for user attendance");

    try {
        let { startingDate, endingDate, userId } = req.body;


        if (!startingDate || !endingDate) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        startingDate = new Date(startingDate);
        endingDate = new Date(endingDate);

        if (isNaN(startingDate) || isNaN(endingDate)) {
            return res.status(400).json({ message: "Invalid date format." });
        }
        
        let attendanceQuery = userId ? { user: userId } : {};
        let leaveQuery = userId ? { user: userId, fromDate: { $lte: endingDate }, toDate: { $gte: startingDate }, Status: true } : { fromDate: { $lte: endingDate }, toDate: { $gte: startingDate }, Status: true };

        const [totalAttendance, totalHolidays, totalLeaves, users] = await Promise.all([
            Attendance.find(attendanceQuery).populate("user"),
            Holidays.find().select("HolidayDate -_id"),
            Leaves.find(leaveQuery).populate("user"),
            userId ? [] : User.find().select("_id Name")
        ]);

        const attendanceMap = new Map(
            totalAttendance.map((a) => {
                if (!a.date) {
                    console.error("Undefined date in attendance record:", a);
                    return [null, a];
                }
                return [a.date.toISOString().split("T")[0] + "-" + a.user._id, a];
            })
        );

        const holidaySet = new Set(
            totalHolidays.map((h) => {
                if (!h.HolidayDate) {
                    console.error("Undefined date in holiday record:", h);
                    return null;
                }
                return h.HolidayDate.toISOString().split("T")[0];
            })
        );

        let leaveSet = new Map();
        totalLeaves.forEach((leave) => {
            let leaveStart = new Date(leave.fromDate);
            let leaveEnd = new Date(leave.toDate);
            while (leaveStart <= leaveEnd) {
                let key = leaveStart.toISOString().split("T")[0] + "-" + leave.user._id;
                leaveSet.set(key, { date: leaveStart.toISOString().split("T")[0], user: leave.user, Remarks: "On Leave" });
                leaveStart.setDate(leaveStart.getDate() + 1);
            }
        });

        let myAttendance = [];
        let currentDate = new Date(startingDate);

        while (currentDate <= endingDate) {
            let dateString = currentDate.toISOString().split("T")[0];
            let dailyAttendance = { date: dateString, records: [] };

            if (userId) {
                let key = dateString + "-" + userId;
                dailyAttendance.records.push(
                    attendanceMap.get(key) || 
                    leaveSet.get(key) ||
                    (holidaySet.has(dateString) ? { user: { _id: userId, name: "Unknown" }, Remarks: "Holiday" } :
                    currentDate.getDay() === 6 ? { user: { _id: userId, name: "Unknown" }, Remarks: "Sunday" } :
                    { user: { _id: userId, name: "Unknown" }, Remarks: "Absent" })
                );
            } else {
                for (let user of users) {
                    let key = dateString + "-" + user._id;
                    dailyAttendance.records.push(
                        attendanceMap.get(key) || 
                        leaveSet.get(key) ||
                        (holidaySet.has(dateString) ? { user: user, Remarks: "Holiday" } :
                        currentDate.getDay() === 6 ? { user: user, Remarks: "Sunday" } :
                        { user: user, Remarks: "Absent" })
                    );
                }
            }

            myAttendance.push(dailyAttendance);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        res.status(200).json(myAttendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};





const getUsersAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: "Date is required in request body." });
        }

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0); // Normalize to start of the day

        // Fetch all users
        const users = await User.find({}, "_id Name");

        // Fetch attendance records for the given date
        const attendanceRecords = await Attendance.find({
            date: {
                $gte: selectedDate,
                $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
            },
        }).populate("user", "_id Name"); // Populate user details

        // Fetch leave records for the given date
        const leaveRecords = await Leaves.find({
            fromDate: { $lte: selectedDate },
            toDate: { $gte: selectedDate },
        }).select("user");

        // Convert leave users to a Set for fast lookup
        const leaveUsers = new Set(leaveRecords.map((leave) => leave.user.toString()));

        // Convert attendance records into a Map for easy lookup
        const attendanceMap = new Map(
            attendanceRecords.map((record) => [record.user._id.toString(), record])
        );

        // Construct final result for all users
        const result = users.map((user) => ({
            _id: user._id,
            Name: user.Name,
            attendanceRecords: attendanceMap.get(user._id.toString()) || 
                (leaveUsers.has(user._id.toString()) ? { Remarks: "On Leave" } : null),
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};





const markEntry = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if user already has an entry for today
        const existingRecord = await Attendance.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) } 
        });

        if (existingRecord) {
            return res.status(400).json({ message: "Entry already marked for today" });
        }

        
        const attendance = new Attendance({
            user: userId,
            entryTime: new Date(),
        });

        await attendance.save();
        res.status(201).json({ message: "Entry marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Error marking entry", error });
    }
};


const markExit = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, projectId, works, goal } = req.body;

        
        const attendance = await Attendance.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) } // Check for today's date
        });

        if (!attendance) {
            return res.status(404).json({ message: "No entry found for today" });
        }

        if (attendance.exitTime) {
            return res.status(400).json({ message: "Exit already marked" });
        }

       
        attendance.exitTime = new Date();
        attendance.workHours = (attendance.exitTime - attendance.entryTime) / (1000 * 60 * 60); 

        await attendance.save();
        if(works!=""){
            await makeMyWork(projectId, userId, works);    
        }else if(goal._id){
            await submitGoal(goal)
        }
        


        res.status(200).json({ message: "Exit marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Error marking exit", error });
    }
};


module.exports={markEntry, markExit, getUsersAttendanceByDate, getUserAttendance, adminCreatesAttendance};