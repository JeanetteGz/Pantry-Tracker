"use client";
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions } from "@mui/material";
import { collection, query, getDocs, setDoc, getDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "./firebase";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Mock function to get recipe suggestions
const getRecipeSuggestions = async (inventory) => {
  // Replace this mock implementation with actual logic
  if (inventory.length === 0) return 'No ingredients available for suggestions.';
  return 'Based on your inventory, here are some recipe suggestions: Pasta, Salad, Smoothie.';
};

export default function Pantry() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSuggestions, setRecipeSuggestions] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const getSuggestions = async () => {
    try {
      // Call the mock or actual implementation of getRecipeSuggestions
      const suggestions = await getRecipeSuggestions(inventory);
      setRecipeSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
      setRecipeSuggestions('Error fetching suggestions.');
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ bgcolor: '#f5f5f5' }} // Light grey background
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          borderRadius="12px"
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
          padding={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6" fontFamily="Roboto, sans-serif" fontWeight={600}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{ borderRadius: '8px', bgcolor: '#7765E3', '&:hover': { bgcolor: '#6a4fdd' } }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          borderRadius: '12px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          bgcolor: '#3b60e4',
          '&:hover': {
            bgcolor: '#6a4fdd'
          }
        }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: '300px', // Set the width to a specific value
          borderRadius: '8px',
          marginBottom: '16px'
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={getSuggestions}
        sx={{
          borderRadius: '12px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          bgcolor: '#FF8C00',
          '&:hover': {
            bgcolor: '#FFA500'
          },
          marginBottom: '16px'
        }}
      >
        Get Recipe Suggestions
      </Button>
      <Typography variant="h6" color="black" fontFamily="Roboto, sans-serif" fontWeight={600}>
        {recipeSuggestions || 'No suggestions available.'}
      </Typography>

      <Box
        width="800px"
        sx={{ 
          maxHeight: '80vh', 
          overflowY: 'auto', 
          backgroundColor: '#3b3b3b', // Dark grey background
          borderRadius: '12px',
          padding: 2
        }}
      >
        <Box
          width="100%"
          height="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          mb={2}
        >
          <Typography variant="h2" color="white" fontFamily="Roboto, sans-serif" fontWeight={700}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" spacing={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Card key={name} sx={{ width: '100%', boxShadow: 3, borderRadius: '12px', bgcolor: '#4f4f4f' }}>
              <CardContent>
                <Typography variant="h5" color="white" fontWeight={600}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="white">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#7765E3', '&:hover': { bgcolor: '#6a4fdd' }, borderRadius: '8px' }}
                  startIcon={<AddIcon />}
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#E76D83', '&:hover': { bgcolor: '#6a4fdd' }, borderRadius: '8px' }}
                  startIcon={<RemoveIcon />}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
