import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      title
      message
      isRead
      createdAt
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($title: String!, $message: String!) {
    createNotification(
      input: {
        title: $title
        message: $message
      }
    ) {
      id
      title
      message
      isRead
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: Int!) {
    markNotificationAsRead(input: { notificationId: $notificationId }) {
      id
      title
      message
      isRead
      createdAt
    }
  }
`;