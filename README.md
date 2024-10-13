To run and test the API on your local machine or server, follow these steps
1. Clone the repository: `git clone <copied link of repository>`
2. Go to the created directive: `cd bimp-test-app or cd <directive you chose for the repository>`
3. Modify the docker-compose.yaml file:
   - Set your own value for `POSTGRES_PASSWORD=<your preferred database password>` for both lines (8 and 20) equally {Required}.
   - Change the `APP_PORT=<your preferred database>` value in line 21, along with the ports definition for bimp-test-app services (line 19) with the same values (Not Required).
  and save the changes.
!!! Please do not change any other lines in this file !!!
4. Run the docker images using the compose file: `docker compose -f docker-compose.yaml up`
5. Wait until execution is complete and your API is available via `http://localhost:9000` (or any other port you specify in docker-compose.yaml).

For development issues, you will need to set POSTGRES_PASSWORD=<your own database password> and APP_PORT=<your own port for the application> variables.
and use the npm scripts to run in different modes and build the application after changes.
