'use strict';
/** @type {import('sequelize-cli').Migration} */

const SQL_QUERY_MIGRATE = `CREATE TABLE public.roles (
	id serial4 NOT NULL,
	name varchar(100) NOT NULL,
	tags jsonb NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('roles');
  }
};