const mongoose = require("mongoose");
const User = require("./models/user");
const Question = require("./models/question");
const Answer = require ("./models/answer");
const Like = require ("./models/like");
const { DUMMY_TEXT_QUESTION, DUMMY_TEXT_ANSWER } = require("./dummy_text");
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/CuriousCatClone", {
  keepAlive: true
});

class DatabaseSeeder {    
    constructor(
        users = ["demo", "Floyd", "Benny", "Kerryn", "Tammy", "Sally"], 
        dummyTextQuestion = DUMMY_TEXT_QUESTION, 
        dummyTextAnswer = DUMMY_TEXT_ANSWER,
        demoUserAnswerLimit = 3,
    ) {
        this.users = users;
        this.userIds = [];
        this.userQuestions = [];
        this.userAnswers = [];
        // The demo user is the first user within the "users" array.
        this.demoUserAnswerLimit = demoUserAnswerLimit;
        this.demoUserAnswerCount = 0;
        this.dummyTextQuestion = dummyTextQuestion;
        this.dummyTextAnswer = dummyTextAnswer;
    }

    async seedDatabase() {
        await this.purgeDatabase();
        await this.createUsers();
        await this.createUserQuestions();
        await this.createUserAnswers();
        await this.createUserLikes();
        await this.assignUserFollowers();
    }

    async purgeDatabase() {
        var models = [User, Question, Answer, Like];
        for (let i = 0, j = models.length; i < j; i++) {
            await models[i].remove({}, (err) => { if (err) throw Error(err) });
        }
    }

    async createUsers() {
        var users = this.generateUserMongooseDocuments();
        for (let i = 0, j = users.length; i < j; i++) {
            var createdUser = await User.create(users[i]);
            this.userIds.push(createdUser.id);
        }
    }

    async createUserQuestions(questionAmount = 6) {
        const createQuestion = async (questionAmount, receiverUserId, giverUserId) => {
            for (let i = 0; i < questionAmount; i++) {
                var question = await Question.create({
                    postedTo: receiverUserId,
                    postedBy: giverUserId,
                    text: this.dummyTextQuestion
                });
                await User.findOneAndUpdate(
                   { _id: receiverUserId },
                   { $push: { questionsReceived: question.id } }
                );
                await User.findOneAndUpdate(
                    { _id: giverUserId },
                    { $push: { questionsGiven: question.id } }
                 );
                 this.userQuestions.push({
                     questionId: question.id,
                     postedTo: receiverUserId,
                     postedBy: giverUserId
                 });
            }
        }
        await this.runFunctionPerUserWithAllUsers(createQuestion.bind(this, questionAmount));
    }

    async createUserAnswers() {
        var demoUserId = this.userIds[0];
        for (let i = 0, j = this.userQuestions.length; i < j; i++) {
            var { questionId, postedTo, postedBy } = this.userQuestions[i];
            if (postedTo === demoUserId) {
                if (this.demoUserAnswerCount < this.demoUserAnswerLimit) {
                    this.demoUserAnswerCount++;
                } else {
                    continue;
                }
            }
            var answer = await Answer.create({
                question: questionId,
                postedTo: postedTo,
                postedBy: postedBy,
                text: this.dummyTextAnswer
            });
            await Question.findOneAndUpdate(
                { _id: questionId },
                { answer: answer.id }
             );
             await User.findOneAndUpdate(
                 { _id: postedBy },
                 { $push: { answersReceived: answer.id } }
              );
            await User.findOneAndUpdate(
                { _id: postedTo },
                { $push: { answersGiven: answer.id } }
             );
             this.userAnswers.push(answer);
        }
    }

    async createUserLikes() {
        this.userAnswers.forEach(async answer => {
            this.userIds.forEach(async userId => {
                if (Math.random() > 0.4) {
                    var like = await Like.create({
                        likedTo: answer.questionId,
                        likedBy: userId
                    });
                    await Answer.findOneAndUpdate(
                        { _id: answer.id },
                        { $push: { likesReceivedPost: like.id } }
                    );
                    await User.findOneAndUpdate(
                        { _id: userId },
                        { $push: { likesGiven: like.id } }
                    );
                    await User.findOneAndUpdate(
                        { _id: answer.postedTo },
                        { $push: { likesReceived: like.id } }
                    );
                }
            });
        });
    }

    async assignUserFollowers() {
        const assignFollowerToUser = async (receiverUserId, giverUserId) => {
            if (Math.random() > 0.4) {
                await User.findOneAndUpdate(
                    { _id: receiverUserId },
                    { $push: { profileFollowers: giverUserId } }
                );
                await User.findOneAndUpdate(
                    { _id: giverUserId },
                    { $push: { profileFollowing: receiverUserId } }
                );
            }
        }
        await this.runFunctionPerUserWithAllUsers(assignFollowerToUser);
    }

    async runFunctionPerUserWithAllUsers(callback) {
        if (typeof(callback) != "function")
            throw Error("callback is not a function");
        for (let i = 0, j = (this.userIds.length - 1); i < j; i++) {
            var nextUserIndex = i + 1;
            var receiverUserId = this.userIds[i];
            while (i != nextUserIndex) {
                if (nextUserIndex > j) {
                    nextUserIndex = 0;
                    if (nextUserIndex === i)
                        break;
                }
                var giverUserId = this.userIds[nextUserIndex];
                await callback.call(this, receiverUserId, giverUserId);
                nextUserIndex++;
            }
        }
    }

    generateUserMongooseDocuments() {
        return this.users.map((username, i) => {
            return {
                username,
                password: i > 0 ? this.getRandomInt(1000000000, 2000000000): "password",
                email: `${username}@demo.com`,
            }
        });
    }

    getRandomInt(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// runtime
(async function() {
    var Seeder = new DatabaseSeeder();
    await Seeder.seedDatabase();
}());