'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.place (
	id serial4 NOT NULL,
	"name" varchar(400) NOT NULL,
	CONSTRAINT place_name_key UNIQUE (name),
	CONSTRAINT place_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('place');
  }
};