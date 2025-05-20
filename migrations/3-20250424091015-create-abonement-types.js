'use strict';
/** @type {import('sequelize-cli').Migration} */

const SQL_QUERY_MIGRATE = `CREATE TABLE public.abonement_types (
	id serial4 NOT NULL,
	"name" varchar(400) NOT NULL,
	"cost" int4 NOT NULL,
	duration interval NOT NULL,
	count_of_classes int4 NOT NULL,
	CONSTRAINT abonement_types_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('abonement_types');
  }
};