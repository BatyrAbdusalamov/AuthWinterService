'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public."groups" (
	id serial4 NOT NULL,
	couch_id int4 NOT NULL,
	kind_of_sport_id int4 NOT NULL,
	"name" varchar(400) NOT NULL,
	min_age int4 NOT NULL,
	max_age int4 NOT NULL,
	clients_count int4 NOT NULL,
	CONSTRAINT groups_pkey PRIMARY KEY (id),
	CONSTRAINT groups_couch_id_fkey FOREIGN KEY (couch_id) REFERENCES public.couches(id),
	CONSTRAINT groups_kind_of_sport_id_fkey FOREIGN KEY (kind_of_sport_id) REFERENCES public.kinds_of_sport(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('groups');
  }
};