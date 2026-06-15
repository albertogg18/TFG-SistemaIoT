// src/components/Layout.tsx
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import styles from './LayoutStyle.module.css';

const drawerWidth = 260;

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Historial', icon: <TableChartIcon />, path: '/historial' },
    { text: 'Gráficas', icon: <BarChartIcon />, path: '/graficas' },
    { text: 'Control de Riego', icon: <WaterDropIcon />, path: '/riego' },
  ];

  return (
    <Box className={styles.root}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#064e3b',
            color: '#ecfdf5',
            borderRight: 'none',
          },
        }}
      >
        <Box className={styles.sidebarHeader}>
          <LocalFloristIcon sx={{ color: '#10b981', fontSize: 32 }} />
          <Typography variant="h6" className={styles.brandText}>
            SmartPlant
          </Typography>
        </Box>

        <List className={styles.navList}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding className={styles.navListItem}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '0.75rem',
                    backgroundColor: isActive ? '#047857' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? '#047857' : '#065f46',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#6ee7b7' : '#a7f3d0', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        className: isActive ? styles.navItemTextActive : styles.navItemTextInactive
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" className={styles.mainContent} sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
        <Outlet />
      </Box>
    </Box>
  );
};