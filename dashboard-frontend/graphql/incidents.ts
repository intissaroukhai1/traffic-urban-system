import { gql } from "@apollo/client";

export const GET_INCIDENTS = gql`
  query GetIncidents {
    incidents {
      id
      type
      description
      location
      status
      createdAt
    }
  }
`;

export const CREATE_INCIDENT = gql`
  mutation CreateIncident(
    $type: String!
    $description: String!
    $location: String!
  ) {
    createIncident(
      input: {
        type: $type
        description: $description
        location: $location
      }
    ) {
      id
      type
      description
      location
      status
      createdAt
    }
  }
`;

export const UPDATE_INCIDENT_STATUS = gql`
  mutation UpdateIncidentStatus($incidentId: Int!, $status: String!) {
    updateIncidentStatus(
      input: {
        incidentId: $incidentId
        status: $status
      }
    ) {
      id
      type
      description
      location
      status
      createdAt
    }
  }
`;