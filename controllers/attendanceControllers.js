const Attendance = require("../models/attendance");
const User = require("../models/user.js");
const { makeMyWork } = require("./worksControllers.js");
const Holidays = require("../models/holidays"); // No need for `{}`
const Leaves = require("../models/leaves")

const getUserAttendance = async (req, res, next) => {
    console.log("Request received for user attendance");

    try {
        let { startingDate, endingDate, userId } = req.body;

        if (!startingDate || !endingDate || !userId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        startingDate = new Date(startingDate);
        endingDate = new Date(endingDate);

        if (isNaN(startingDate) || isNaN(endingDate)) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        // Fetch attendance records, holidays, and leave records
        const [totalAttendance, totalHolidays, totalLeaves] = await Promise.all([
            Attendance.find({ user: userId }),
            Holidays.find().select("date -_id"),
            Leaves.find({ user: userId, fromDate: { $lte: endingDate }, toDate: { $gte: startingDate }, Status:true }) // Fetch leaves in range
        ]);

        // Convert data to easy lookup formats
       const attendanceMap = new Map(
            totalAttendance.map((a) => {
                if (!a.date) {
                    console.error("Undefined date in attendance record:", a);
                    return [null, a];  // Returning null for debugging
                }
                return [a.date.toISOString().split("T")[0], a];
            })
        );

        const holidaySet = new Set(
            totalHolidays.map((h) => {
                if (!h.date) {
                    console.error("Undefined date in holiday record:", h);
                    return null;
                }
                return h.date.toISOString().split("T")[0];
            })
        );

        // Create leave date ranges
        let leaveSet = new Set();
        totalLeaves.forEach((leave) => {
            let leaveStart = new Date(leave.fromDate);
            let leaveEnd = new Date(leave.toDate);
            while (leaveStart <= leaveEnd) {
                leaveSet.add(leaveStart.toISOString().split("T")[0]);
                leaveStart.setDate(leaveStart.getDate() + 1);
            }
        });

        let myAttendance = [];
        let currentDate = new Date(startingDate);

        while (currentDate <= endingDate) {
            let dateString = currentDate.toISOString().split("T")[0];

            if (attendanceMap.has(dateString)) {
                myAttendance.push(attendanceMap.get(dateString));
            } else if (leaveSet.has(dateString)) {
                myAttendance.push({ date: dateString, Remarks: "On Leave" });
            } else if (holidaySet.has(dateString)) {
                myAttendance.push({ date: dateString, Remarks: "Holiday" });
            } else if (currentDate.getDay() === 6) {
                myAttendance.push({ date: dateString, Remarks: "Sunday" });
            } else {
                myAttendance.push({ date: dateString, Remarks: "Absent" });
            }

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
        const { userId, projectId, works } = req.body;

        
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

        makeMyWork(projectId, userId, works);


        res.status(200).json({ message: "Exit marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Error marking exit", error });
    }
};


module.exports={markEntry, markExit, getUsersAttendanceByDate, getUserAttendance};