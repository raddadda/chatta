const { User, Friend_List, Chat_Room_Join, Chat_Room } = require('../models');
const constant = require('../common/constant');
const Cauth = require('./Cauth');

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    const age = currentDate.getFullYear() - birthDate.getFullYear();

    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDate.getMonth();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
        return age - 1;
    } else {
        return age;
    }
}

const getOwnerChatRooms = async (userId) => {
    try {
        // 사용자가 소유한 채팅방 목록
        const ownerChatRooms = await Chat_Room.findAll({
            where: { owner_id: userId },
        });

        return ownerChatRooms;
    } catch (error) {
        console.error('채팅방 가져오기 오류:', error);
        throw error;
    }
};

const getUserChatRooms = async (userId) => {
    try {
        // 사용자가 참여한 채팅방 목록
        const userChatRooms = await Chat_Room.findAll({
            include: [
                {
                    model: Chat_Room_Join,
                    where: { user_id: userId },
                },
            ],
        });

        return userChatRooms;
    } catch (error) {
        console.error('채팅방 가져오기 오류:', error);
        throw error;
    }
};

const getSchedules = async (userId) => {
    try {
        // const schedules = await Schedule.findAll({ where: { user_id: userId } });
        // return schedules;
    } catch (error) {
        console.error('일정 가져오기 오류:', error);
        throw error;
    }
};

const profile = async (req, res) => {
    try {
        const cookieValue = req.signedCookies.logined.id;
        const userId = await Cauth.stringToUuid(cookieValue);

        const user = await User.findOne({ where: { user_id: userId } });

        const friendCount = await Friend_List.count({ where: { user_id: userId } });
        const ownerChatRooms = await getOwnerChatRooms(userId);
        const userChatRooms = await getUserChatRooms(userId);
        const schedules = await getSchedules(userId);
        const age = await calculateAge(user.birth);

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
        }

        res.render('profile', { user, age, friendCount, ownerChatRooms, userChatRooms, schedules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '내부 서버 오류' });
    }
};

module.exports = {
    profile,
}
