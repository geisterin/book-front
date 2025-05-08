import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';


const BookDetailPage = () => {
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editBook, setEditBook] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBook(response.data);
      setEditBook(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке книги:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate('/books');
      } catch (error) {
        console.error('Ошибка при удалении книги:', error);
      }
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/books/${id}`, editBook, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOpenEditDialog(false);
      fetchBook();
    } catch (error) {
      console.error('Ошибка при редактировании книги:', error);
    }
  };

  const handleComment = async () => {
    try {
      await axios.post(`http://localhost:3000/api/books/${id}/comments`, 
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setComment('');
      fetchBook();
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };

  if (!book) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {book.title}
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Автор: {book.author}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Жанр: {book.genre}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Год издания: {book.year}
        </Typography>

        {userRole === 'Admin' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenEditDialog(true)}
              sx={{ mr: 2 }}
            >
              Редактировать
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Комментарии
          </Typography>
          <List>
            {book.comments?.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={comment.text}
                  secondary={`Автор: ${comment.author}`}
                />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Добавить комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleComment}
              sx={{ mt: 2 }}
            >
              Отправить комментарий
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Редактировать книгу</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название"
            value={editBook.title}
            onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Автор"
            value={editBook.author}
            onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Жанр"
            value={editBook.genre}
            onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Год издания"
            value={editBook.year}
            onChange={(e) => setEditBook({ ...editBook, year: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Отмена</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookDetailPage; 