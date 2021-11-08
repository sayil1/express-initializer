import express from express
import cors from cors
import bodyparser from body-parser

const app = express();
app.get('/', (req, res) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
 });
