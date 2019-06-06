const express = require('express');

const app = express();

app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public/'), express.static(__dirname + '/views/'));

app.get('/',(req,res)=>{
    res.sendFile('/index.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});