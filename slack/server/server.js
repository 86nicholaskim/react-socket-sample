// 필요한 모듈 로드
const privateMsg = require('./privateMsg');
const groupMsg = require('./groupMsg');
const common = require('./common');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // dotenv 패키지를 사용하여 .env 파일 로드

// 환경 변수에서 MongoDB 연결 URI 가져오기
const uri = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

const io = require('socket.io')(5000, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);

// // MongoDB에 연결
// mongoose.connect(mongodbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // 연결된 후 동작
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', function () {
//   console.log('Connected to MongoDB database');
// });

// 여기에 스키마 및 모델 정의 및 다른 작업을 추가할 수 있습니다.
