const { User, Friend_List, Chat_Room_Join, Chat_Room, Chat_Message, Board, Board_Bookmark } = require('../models');
const constant = require('../common/constant');
const Cauth = require('./Cauth');
const { Op } = require('sequelize');

const profile = async (req, res) => {
    try {
        const getCheck = await Cauth.getAuthCheck(req, res);
        if (!getCheck) {
            res.redirect('/')
            return;
        }
        const cookieValue = req.signedCookies.logined.id;
        const userId = await Cauth.stringToUuid(cookieValue);

        const user = await User.findOne({ where: { user_id: userId } });

        const friendCount = await getFriendCount(userId);

        const ownerChatRooms = await getOwnerChatRooms(userId);
        const userChatRooms = await getUserChatRooms(userId);
        const allChatRooms = ownerChatRooms.concat(userChatRooms);

        for (const room of allChatRooms) {
            room.unreadMessages = await calculateUnreadMessages(room.id, userId);
            room.latestUnreadMessage = await getLatestUnreadMessage(room.id, userId);
        };

        const bookmarkedBoards = await getBookmarkedBoards(userId);
        const schedules = await getSchedules(userId);
        const age = await calculateAge(user.birth);

        if (!user) {
            return res.status(404).render('404');
        }

        console.log(user, age, friendCount, ownerChatRooms, userChatRooms, bookmarkedBoards, schedules)
        res.render('profile', { user, age, friendCount, ownerChatRooms, userChatRooms, bookmarkedBoards, schedules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '내부 서버 오류' });
    }
};

const calculateAge = (birthdate) => {
    // 생년월일로 나이 계산
    try {
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
    } catch (error) {
        console.error('나이 계산 오류:', error);
        throw error;
    }
};

const getFriendCount = async (userId) => {
    try {
        const userFriendsCount = await Friend_List.count({ where: { user_id: userId } });
        const friendFriendsCount = await Friend_List.count({ where: { friend_id: userId } });
        const totalFriendCount = userFriendsCount + friendFriendsCount;

        return totalFriendCount;
    } catch (error) {
        console.error('친구 수 계산 오류:', error);
        throw error;
    }
};

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

const calculateUnreadMessages = async (roomId, userId) => {
    try {
        // roomId와 userId를 사용하여 해당 채팅방의 안 읽은 메시지 수 계산
        const unreadMessages = await Chat_Message.count({
            where: { room_id: roomId, user_id: { [Op.ne]: userId }, is_read: false },
        });

        return unreadMessages;
    } catch (error) {
        console.error('안 읽은 메시지 수 계산 오류:', error);
        throw error;
    }
};

const getLatestUnreadMessage = async (roomId, userId) => {
    try {
        const latestUnreadMessage = await Chat_Message.findOne({
            where: {
                room_id: roomId,
                user_id: { [Op.ne]: userId },
                is_read: false,
            },
            order: [['createdAt', 'DESC']],
        });

        return latestUnreadMessage;
    } catch (error) {
        console.error('가장 최신의 안 읽은 메시지 가져오기 오류:', error);
        throw error;
    }
};

const getBookmarkedBoards = async (userId) => {
    try {
        // 사용자가 북마크한 게시물 목록
        const bookmarkedBoards = await Board_Bookmark.findAll({
            where: { user_id: userId },
            include: [Board],
        });

        return bookmarkedBoards.map((bookmark) => bookmark.Board);
    } catch (error) {
        console.error('북마크한 게시물 가져오기 오류:', error);
        throw error;
    }
};

const getSchedules = async (userId) => {
    try {
        // const schedules = await Schedule.findAll({ where: { user_id: userId } });
        // return schedules;
        return [];
    } catch (error) {
        console.error('일정 가져오기 오류:', error);
        throw error;
    }
};

module.exports = {
    profile,
}
