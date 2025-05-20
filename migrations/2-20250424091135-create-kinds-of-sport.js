'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.kinds_of_sport (
	id serial4 NOT NULL,
	"name" varchar(400) NOT NULL,
	image varchar(4000) NULL,
	CONSTRAINT kinds_of_sport_name_key UNIQUE (name),
	CONSTRAINT kinds_of_sport_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('kinds_of_sport');
  }
};