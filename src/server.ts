const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
const server = app.listen(PORT, ()=> console.log(`Server Running on  ${PORT}`));

process.on('SIGINT', () => {
    server.close()
    console.log('-> [ App finalizado : API ]')
})