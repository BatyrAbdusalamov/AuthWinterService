'use strict';
/** @type {import('sequelize-cli').Migration} */

const SQL_QUERY_MIGRATE = `CREATE TABLE public.clients (
	id serial4 NOT NULL,
	"name" varchar(400) NOT NULL,
	phone_number varchar(400) NOT NULL,
	date_of_birth timestamp NOT NULL,
	"size" varchar(400) NOT NULL,
	"role" int4 NULL,
	"password" varchar(400) NULL,
	CONSTRAINT clients_pkey PRIMARY KEY (id),
	CONSTRAINT clients_role_fkey FOREIGN KEY ("role") REFERENCES public.roles(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('clients');
  }
};