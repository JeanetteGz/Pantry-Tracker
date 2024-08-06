"use client";
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions, Grid } from "@mui/material";
import { collection, query, getDocs, setDoc, getDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useState, useEffect } from "react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

const getRecipeSuggestions = async (inventory) => {
  if (inventory.length === 0) return [];

  const ingredients = inventory.map(item => item.name).join(',');

  try {
    const response = await axios.get(SPOONACULAR_API_URL, {
      params: {
        ingredients,
        number: 10, // Increase if you want more suggestions
        ranking: 1, // Ranking type: 1 - minimize missing ingredients
        apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
      },
    });

    const recipes = response.data;

    if (recipes.length === 0) {
      return [];
    }

    // Filter to allow recipes with up to 2 missing ingredients
    const filteredRecipes = recipes.filter(recipe => recipe.missedIngredientCount <= 2);

    return filteredRecipes;
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    return [];
  }
};

export default function Pantry() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
      const suggestions = await getRecipeSuggestions(inventory);
      setRecipeSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
      setRecipeSuggestions([]);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
        },
      });
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleCloseRecipe = () => setSelectedRecipe(null);

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
      flexDirection="column"
      alignItems="center"
      sx={{ 
        bgcolor: '#2e2e2e', 
        padding: 2,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {/* Inventory Section */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{ bgcolor: '#3b3b3b', padding: 2, borderRadius: '12px', boxShadow: 3 }} // Dark grey background
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
                sx={{ 
                  transform: 'translate(-50%, -50%)', 
                  bgcolor: '#4f4f4f', // Dark grey background
                  overflowY: 'auto', 
                  maxHeight: '80vh' 
                }}
              >
                <Typography variant="h6" fontFamily="Roboto, sans-serif" fontWeight={700} color="white">Add Item</Typography>
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    InputProps={{ style: { borderRadius: '8px', color: 'white' } }}
                    sx={{ bgcolor: '#6a6a6a' }} // Input field background color
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
                bgcolor: '#6a4fdd',
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
                width: '100%', // Full width on smaller screens
                maxWidth: '300px', // Limit width on larger screens
                borderRadius: '8px',
                marginBottom: '16px',
                bgcolor: '#6a6a6a' // Input field background color
              }}
              InputProps={{ style: { color: 'white' } }} // Input text color
            />
            <Box
              width="100%"
              sx={{ 
                maxHeight: '70vh', 
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
        </Grid>

        {/* Recipe Suggestions Section */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{ bgcolor: '#3b3b3b', padding: 2, borderRadius: '12px', boxShadow: 3 }} // Dark grey background
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={getSuggestions}
              sx={{
                borderRadius: '12px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                bgcolor: '#E76D83',
                '&:hover': {
                  bgcolor: '#FFA500'
                },
                marginBottom: '16px'
              }}
            >
              Get Recipe Suggestions
            </Button>
            <Grid container spacing={2}>
              {recipeSuggestions.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      boxShadow: 3,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6,
                      },
                      bgcolor: '#4f4f4f' // Dark grey background for recipe cards
                    }}
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} color="white">
                        {recipe.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recipe.missedIngredientCount} missing ingredients
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Recipe Details Modal */}
      <Modal open={!!selectedRecipe} onClose={handleCloseRecipe}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={600}
          borderRadius="12px"
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
          padding={4}
          sx={{ 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#4f4f4f', // Dark grey background
            overflowY: 'auto', 
            maxHeight: '80vh' 
          }}
        >
          {selectedRecipe && (
            <>
              <Typography variant="h4" fontWeight={600} color="white">
                {selectedRecipe.title}
              </Typography>
              <Box component="div" sx={{ mt: 2, lineHeight: 1.5 }}>
                <Typography variant="body1" component="div" color="white">
                  <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleCloseRecipe}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}