'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.classes (
	id serial4 NOT NULL,
	place_id int4 NOT NULL,
	group_id int4 NULL,
	date_time timestamp NOT NULL,
	duration int4 NOT NULL,
	CONSTRAINT classes_pkey PRIMARY KEY (id),
	CONSTRAINT classes_group_id_fkey FOREIGN KEY (group_id) REFERENCES public."groups"(id),
	CONSTRAINT classes_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('classes');
  }
};