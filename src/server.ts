import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

const port = 3000;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('running');
});

AppDataSource
  .initialize()
  .then(() => {
    console.log('successfully connected');
  })
  .catch((error) => {
    console.error(error);
  })

// create
app.post('/users', async (req, res) => {
   const user = await AppDataSource.getRepository(User).create(req.body);
   console.log(user);
   const results = await AppDataSource.getRepository(User).save(user);
   return res.send(results);
});

// read all
app.get('/users', async (req, res) => {
  const results = await AppDataSource.getRepository(User).find();
  res.json(results);
});

// read by id
app.get('/users/:id', async (req, res) => {
  const results = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id)
  })
  return res.json(results);
});

// update
app.put('/users/:id', async (req, res) => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id)
  })
  AppDataSource.getRepository(User).merge(user, req.body);
  const results = await AppDataSource.getRepository(User).save(user);
  return res.json(results);
});

// delete
app.delete('/users/:id', async (req, res) => {
  const results = await AppDataSource.getRepository(User).delete(req.params.id);
  return res.json(results);
});

app.listen(port, () => {
  console.log(`Start on server ${port}`);
});