import { gql } from "@apollo/client";

export const GET_TRAFFIC_ZONES = gql`
  query GetTrafficZones {
    trafficZones {
      id
      name
      location
      vehicleCount
      density
      level
      congested
    }
  }
`;

export const CREATE_TRAFFIC_ZONE = gql`
  mutation CreateTrafficZone(
    $name: String!
    $location: String!
    $vehicleCount: Int!
  ) {
    createTrafficZone(
      input: {
        name: $name
        location: $location
        vehicleCount: $vehicleCount
      }
    ) {
      id
      name
      location
      vehicleCount
      density
      level
      congested
    }
  }
`;

export const UPDATE_TRAFFIC_DENSITY = gql`
  mutation UpdateTrafficDensity($zoneId: Int!, $vehicleCount: Int!) {
    updateTrafficDensity(
      input: {
        zoneId: $zoneId
        vehicleCount: $vehicleCount
      }
    ) {
      id
      name
      location
      vehicleCount
      density
      level
      congested
    }
  }
`;

export const GET_CONGESTED_ZONES = gql`
  query GetCongestedZones {
    congestedZones {
      id
      name
      location
      vehicleCount
      level
      congested
    }
  }
`;