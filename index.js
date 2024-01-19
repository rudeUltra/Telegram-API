const TelegramBot = require('node-telegram-bot-api');
const axios=require('axios');
const mongoose=require('mongoose');


const token = '6791510546:AAHX4HDMVRztEFECRVYo4c0WEcTk_NpVWZw';
const weatherToken='0d61eb69395798cb9e35e06bbb8d45e3';

async function getWeatherData(city) {
    try {
        const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherToken}`
        );

        const responseCode = response.data.cod;

        const weatherData = response.data;
        const temperature = Math.round(weatherData.main.temp - 273.15);
        const messageText = `The weather in ${city} is currently ${weatherData.weather[0].description} with a temperature of ${temperature}°C.`;
        const imgIcon=weatherData.weather[0].icon;
        return [messageText,imgIcon];
    } catch (error) {
        // Handle any other errors that might occur during the API call
        console.error("Error fetching weather data:", error.message);
        return ['Please Enter correct city','-1'];
    }
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"

bot.onText(/\/register/, (msg, match) => {

    console.log(msg);
  
    const chatId = msg.chat.id;
    const User=msg.from.id;

    addUser(User)
    .then((user) => {
        bot.sendMessage(chatId,"Success");
    })
    .catch((error) => {
        // Handle the error
        bot.sendMessage(chatId,"User Already Added");
    });


  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   console.log(msg);
//   bot.sendMessage(chatId, 'Received your message');
// });


bot.on('message', async (msg) => {
    if (msg.text.startsWith('/')) {
        return; // Do nothing if the message starts with '/'
    }

    const User = msg.from.id;
    console.log(typeof(User))
    

    try {
        const userExists = await checkUserExists(User);
        

        if (userExists) {
            const chatId = msg.chat.id;
            const city = msg.text;

            try {
                const [messageText, imgIcon] = await getWeatherData(city);

                bot.sendMessage(chatId, messageText);

                if (messageText !== 'Please Enter correct city') {
                    const url = `https://openweathermap.org/img/wn/${imgIcon}@2x.png`;
                    bot.sendPhoto(chatId, url);
                }
            } catch (error) {
                console.error("Error processing weather data:", error.message);
                bot.sendMessage(chatId, "An error occurred while fetching weather data. Please try again later.");
            }
        } else {
            bot.sendMessage(User, "Please Register first using the /register command");
        }
    } catch (error) {
        console.error("Error checking user existence:", error.message);
        bot.sendMessage(User, "An error occurred while checking user existence. Please try again later.");
    }
});


//Database for users



// Mongoose initiation
mongoose.connect("mongodb+srv://rudhradeep:KhGlCU7jNUyS3os4@kuebiko.zfkcgjn.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
}).then(()=>{
  console.log("Connected to Database");
})


const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));

// Mongoose Schema
const Schema = mongoose.Schema;

const UserConSchema = new Schema({
    userId: { type: Number, unique: true, required: true },
    
  });
  const UserCon1 = mongoose.model("UserCon1", UserConSchema); //User Information database
//   const user = new UserCon({
//     userId: req.body.username
//   });



  
  // Function to add a new user
  async function addUser(user) {
      try {
          const newUser = new UserCon1({
              userId:user
          });
  
          // Save the new user to the database
          const savedUser = await newUser.save();
  
          console.log("User added successfully:", savedUser);
          return savedUser;
      } catch (error) {
          console.error("Error adding user:", error.message);
          throw error; // Re-throw the error for the calling function to handle
      }
  }
  
  // Function to check if a user with a given email already exists
  async function checkUserExists(userId) {
    try {
        const existingUser = await UserCon1.findOne({ userId });
        return !!existingUser; // Returns true if the user exists, false otherwise
    } catch (error) {
        console.error("Error checking user existence:", error.message);
        throw error;
    }
}

  
  // Example usage:
  
  // Add a new user

  
  // if (!msg.text.startsWith('/')) {
    //     const chatId = msg.chat.id
    //     const city = msg.text

    //     const User=msg.from.id;

       
        


    
    //     try {


    //         const [messageText, imgIcon] = await getWeatherData(city);
    
    //         bot.sendMessage(chatId, messageText);
    
    //         if (messageText === 'Please Enter correct city') {
    //             console.log(imgIcon);
    //         } else {
    //             const url = `https://openweathermap.org/img/wn/${imgIcon}@2x.png`;
    //             bot.sendPhoto(chatId, url);
    //         }
    //     } catch (error) {
    //         console.error("Error processing weather data:", error.message);
    //         bot.sendMessage(chatId, "An error occurred while fetching weather data. Please try again later.");
    //     }

    // }\

    // const webhookUrl = 'https://resilient-melba-974c6b.netlify.app/.netlify/functions/api';

    // bot.setWebHook(webhookUrl);