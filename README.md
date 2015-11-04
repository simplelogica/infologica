# infologica
Web based network information panel for information radiators.

## App structure
At the moment, the project is structured in two different parts:
* Client: get data from the server using an API and shows updated data in the screen.
* Server: based on NodeJS, Express and MongoDB, run periodic task to obtain data from different sources and make them available through an API.

## Data available
There are several types of information available on the application, each one modeled by it's own model. They described below with their associated fields (and their meaning).

However, there are some common fields that are applied to every model:
* `\_id`: The unique identifier in the application storage (MongoDB).
* `createdAt`: A timestamp with the time of creation of the element stored.
* `updatedAt`: A timestamp with the time of the last update to the element.

### NetworkData
This type of data is used to store the information collected about the network usage from an SNMP server on a networking element (such a router or a load balancer for example).

Fields available:
* `downloadRate`: the network download rate at the moment of the capture. Specified in bits per second.
* `uploadRate`: the network upload rate at the moment of the capture. Specified in bits per second.
* `connections`: an array with all the IP's to which the connections are made to/from using the network.

## Available API endpoints
There are some endpoints when you can get:
* `GET /api/network_data` : Fetch all the network data stored and sorted by it's creation time. There can be some query params:
  * `limit` (optional): an integer that indicates the number of results to return
  * `last` (optional): the `\_id` value of the last received element, so only newer elements would be returned.
* `GET /api/network_data/:id` : Retrieve an specific NetworkData element specified by it's `\_id`.
