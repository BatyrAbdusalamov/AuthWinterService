'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.clients_groups (
	id serial4 NOT NULL,
	client_id int4 NOT NULL,
	group_id int4 NOT NULL,
	CONSTRAINT clients_groups_pkey PRIMARY KEY (id),
	CONSTRAINT clients_groups_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
	CONSTRAINT clients_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."groups"(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('clients_groups');
  }
};