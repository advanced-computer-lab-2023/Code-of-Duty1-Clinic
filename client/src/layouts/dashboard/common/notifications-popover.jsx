import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import { fToNow } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { axiosInstance } from '../../../utils/axiosInstance';

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const userID = localStorage.getItem('userId');
  const [totalUnseen, setTotalUnseen] = useState(notifications.filter((item) => !item.isSeen).length);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const joinRoom = () => {
    if (socket) {
      socket.emit('joinNotificationRoom', { userID: userID });
    }
  };
  useEffect(() => {
    const newSocket = io('http://localhost:3000/notification', {
      withCredentials: true
    });
    setSocket(newSocket);
    const fetchNotification = async () => {
      try {
        const response = await axiosInstance.get(`/notifications/${userID}`);
        const sortedNotifications = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNotifications(sortedNotifications);
        // setNotifications(response.data);
      } catch (error) {
        console.error('Error when fetching notifications', error);
      }
    };
    fetchNotification();
  }, []);
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Connected to the socket server');
        joinRoom();
      };

      const handleNewNotification = (newNotification) => {
        setNotifications((prev) => {
          const updatedNotification = [...prev, newNotification];
          return updatedNotification;
        });
      };

      const handleUpdate = async () => {
        console.log('in setSeen123');
        try {
          const response = await axiosInstance.get(`/notifications/${userID}`);
          setNotifications((pre) => response.data);
        } catch (error) {
          console.error('Error when fetching notifications', error);
        }
      };

      if (socket) {
        console.log(socket, '7878');
        socket.on('connect', handleConnect);
        socket.on('notification', handleNewNotification);
        socket.on('update', handleUpdate);
      }

      return () => {
        socket.off('connect', handleConnect);
        socket.off('notification', handleNewNotification);
        socket.off('update', handleUpdate);
      };
    }
  }, [socket, userID]);
  useEffect(() => {
    setTotalUnseen(notifications.filter((item) => !item.isSeen).length);
  }, [notifications]);
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isSeen: true
      }))
    );

    if (socket) {
      socket.emit('notification', notifications);
    }
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id == notificationId ? { ...notification, isSeen: true } : notification
      )
    );
    let unseenNotifications = notifications.filter((notification) => notification._id == notificationId);
    if (socket) {
      socket.emit('notification', unseenNotifications);
    }
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnseen} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnseen} unread messages
            </Typography>
          </Box>

          {totalUnseen > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
              New
            </ListSubheader>
            {notifications.map((notification) => {
              if (notification.isSeen) return;
              return (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification._id)}
                  isUnseen
                />
              );
            })}

            {/* All Notifications (including seen) */}
            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
              All Notifications
            </ListSubheader>
            {notifications.map((notification) => {
              if (!notification.isSeen) return;
              return (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                // onClick={() => handleNotificationClick(notification._id)}
                />
              );
            })}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={handleViewAllClick}>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any
  }),
  onClick: PropTypes.func,
  isUnseen: PropTypes.bool
};

function NotificationItem({ notification, onClick, isUnseen }) {
  const { title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(isUnseen && {
          bgcolor: 'info.light' // Change the color for unseen notifications
        })
      }}
      onClick={onClick}
    >
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.date)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.content}
      </Typography>
    </Typography>
  );

  return {
    title
  };
}
