import { gql } from "@apollo/client";

export const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      plateNumber
      type
      status
    }
  }
`;

export const GET_VEHICLES_WITH_POSITIONS = gql`
  query GetVehiclesWithPositions {
    vehicles {
      id
      plateNumber
      type
      status
      positions {
        id
        latitude
        longitude
        timestamp
      }
    }
  }
`;

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $plateNumber: String!
    $type: String!
    $status: String!
  ) {
    createVehicle(
      input: {
        plateNumber: $plateNumber
        type: $type
        status: $status
      }
    ) {
      id
      plateNumber
      type
      status
    }
  }
`;

export const ADD_GPS_POSITION = gql`
  mutation AddGpsPosition(
    $vehicleId: Int!
    $latitude: Float!
    $longitude: Float!
  ) {
    addGpsPosition(
      input: {
        vehicleId: $vehicleId
        latitude: $latitude
        longitude: $longitude
      }
    ) {
      id
      latitude
      longitude
      timestamp
    }
  }
`;