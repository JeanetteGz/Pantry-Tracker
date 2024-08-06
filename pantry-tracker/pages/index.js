"use client";

import { useRouter } from "next/router";
import { Box, Button, Typography, Grid, Card, CardContent } from "@mui/material";


export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/pantry');
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ 
        bgcolor: '#2e2e2e',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 4,
        textAlign: 'center',
        color: 'white'
      }}
    >
      {/* Hero Section */}
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        gap={2}
        sx={{ mb: 6 }}
      >
        <Typography variant="h2" fontWeight={700}>Welcome to Pantry Tracker</Typography>
        <Typography variant="h5" fontWeight={300}>Manage your pantry effortlessly and get recipe suggestions based on your inventory.</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGetStarted}
          sx={{ 
            mt: 4, 
            borderRadius: '12px', 
            padding: '12px 24px', 
            bgcolor: '#E76D83',
            '&:hover': {
              bgcolor: '#FFA500'
            }
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#3b3b3b', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>Inventory Management</Typography>
              <Typography variant="body1">Easily add, remove, and search for items in your pantry.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#3b3b3b', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>Recipe Suggestions</Typography>
              <Typography variant="body1">Get recipe ideas based on the ingredients you have available.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#3b3b3b', color: 'white', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>Easy to Use</Typography>
              <Typography variant="body1">Intuitive and user-friendly interface to manage your pantry.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2">© 2024 Pantry Tracker. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}
