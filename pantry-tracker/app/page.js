"use client";

import { Box, Stack, Typography } from "@mui/material";
import { firestore } from "./firebase";
import { collection, query } from "firebase/firestore";
import { useEffect } from "react";
import { getDocs } from "firebase/firestore";

const item = [
  "Apple",
  "Banana",
  "Orange",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
  "Pineapple",
  "Watermelon",
  "Kiwi",
];

export default function Home() {
  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      docs.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    };
    updatePantry();
  }, []);

  return ( 
    <Box 
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    >
      <Box border={'1px solid #333'}>
      <Box 
      width="800px" 
      height="100px" 
      bgcolor={'lightcoral'} 
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}>
        <Typography variant={'h1'} color={'#333'} textAlign={'center'}>
          Pantry Tracker
        </Typography>
      </Box>

      <Stack width="800px" height="200px" spacing={2} overflow={'auto'}>
        {item.map((i) => (
          <Box
            key={i}
            width="100%"
            height="100px"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
          >
            <Typography
            variant={'h3'}
            color={'#333'}
            textAlign={'center'}
            >
              {
                // Capitalize the first letter of each item
                i.charAt(0).toUpperCase() + i.slice(1)
              }
            </Typography>
        </Box>
      ))}
    </Stack>
    </Box>
  </Box>
  );
}