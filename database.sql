--
-- PostgreSQL database dump
--

\restrict eGlZ533s0Ut7M6tI6UGf75c69Cq8EXqM5ZVFV6c6M7Q4BkCluLtim9HzIA5zTJN

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: project_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.project_role AS ENUM (
    'viewer',
    'editor',
    'admin'
);


ALTER TYPE public.project_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_id uuid NOT NULL,
    project_id uuid,
    action character varying(50) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- Name: asset_subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_subcategories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.asset_subcategories OWNER TO postgres;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    subcategory_id uuid,
    name character varying(255) NOT NULL,
    image_path text,
    width double precision NOT NULL,
    height double precision NOT NULL,
    min_width double precision NOT NULL,
    max_width double precision NOT NULL,
    min_height double precision NOT NULL,
    max_height double precision NOT NULL,
    default_points jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- Name: placed_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.placed_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    width double precision NOT NULL,
    height double precision NOT NULL,
    rotation double precision DEFAULT 0,
    z_index integer DEFAULT 0,
    points jsonb,
    color character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.placed_items OWNER TO postgres;

--
-- Name: project_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_members (
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public.project_role DEFAULT 'viewer'::public.project_role NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_members OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    thumbnail_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    hash_password text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, actor_id, project_id, action, metadata, created_at) FROM stdin;
21f0da5d-4ccb-4ee8-b7a0-94924e8606de	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_ADDED	{"memberName": "yuyu"}	2026-07-30 22:10:35.596315
a4ca143c-abdb-4fea-86c2-b2c47e4b1ae4	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_ADDED	{"memberName": "yuyu"}	2026-07-30 22:16:29.784276
8d339e97-8af5-41c2-9e96-a0d6f2c9f45d	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_DELETED	{"memberName": "yuyu", "projectName": "test"}	2026-07-30 22:16:32.538421
0b457b70-c23d-4675-a121-e696da803e12	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_ADDED	{"memberName": "yuyu"}	2026-07-30 22:17:16.589404
d2fa47de-b8e1-402f-b6b9-2c5f26a8a70d	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_DELETED	{"memberName": "yuyu", "projectName": "test"}	2026-07-30 22:18:02.646527
8b4c63ae-f4a8-4372-9eb8-962eedc7cd3b	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_ADDED	{"memberName": "yuyu"}	2026-07-30 22:20:54.555806
757004e1-28b4-4ef0-aa66-46344eaf7414	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_DELETED	{"memberName": "yuyu", "projectName": "testProject"}	2026-07-31 03:46:00.044828
ef08c45a-6aec-412e-b22a-39e4a93aba38	0d276714-02e1-4341-a71f-6052e612f042	\N	MEMBER_ADDED	{"memberName": "yuyu", "projectName": "testProject"}	2026-07-31 03:46:39.795293
b8452aea-e7c2-4236-af17-6d358416bf68	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_CREATED	{"projectName": "NSPU"}	2026-08-03 08:41:48.718531
bcc36816-4a7a-44b3-85a3-131a178e2e0d	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_ADDED	{"memberName": "paige", "projectName": "NSPU"}	2026-08-03 12:54:02.378307
66fa36e9-429d-4b3a-a79d-197bfeef6dec	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_DELETED	{"memberName": "paige", "projectName": "NSPU"}	2026-08-03 12:55:19.663572
6d4b2172-582f-45a0-9296-e242685c394e	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_ADDED	{"memberName": "paige", "projectName": "NSPU"}	2026-08-03 12:59:49.595722
488d7dc5-bcd8-4e00-9e85-e0d8549a612a	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_DELETED	{"memberName": "paige", "projectName": "NSPU"}	2026-08-03 12:59:52.265524
c2a65d6b-3445-4ce9-bf44-0349c2f2c25a	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_ADDED	{"memberName": "paige", "projectName": "NSPU"}	2026-08-03 13:00:02.298894
ddaec890-7d95-4ff4-b360-f9b7cb56f0e9	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_DELETED	{"projectName": "NSPU Model"}	2026-08-03 14:16:41.713457
84bb449e-9d96-4dcf-8ec6-1d60c3c7787d	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_DELETED	{"projectName": "NSPU"}	2026-08-03 14:27:14.14653
7b7399b0-969d-447a-8bbe-2e549487ecd6	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"projectName": "NSPU Model"}	2026-08-03 14:47:06.693355
28d5b5c0-44a4-4168-8249-4772698dffbc	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"newProjectName": "NSPU", "oldProjectName": "NSPU"}	2026-08-03 14:53:22.895304
e0c4d445-d689-434f-8aa0-a4c0fc45438c	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"newProjectName": "hi", "oldProjectName": "NSPU"}	2026-08-03 15:19:43.450808
6f303418-0d1f-4d6f-87f8-f4c1fce7304a	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"newProjectName": "NSPU", "oldProjectName": "hi"}	2026-08-03 15:19:51.144509
77665469-3bbc-4a9f-9ac4-d941a67cb01e	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"newProjectName": "afsd", "oldProjectName": "NSPU"}	2026-08-03 15:20:13.119363
58ff006f-a4cd-4c8b-942d-0fcb81d7d232	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	PROJECT_RENAMED	{"newProjectName": "NSPU", "oldProjectName": "afsd"}	2026-08-03 15:20:21.561204
dce74d27-6d19-4645-8c15-caa3fbfa4278	0d276714-02e1-4341-a71f-6052e612f042	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	PROJECT_CREATED	{"projectName": "Map"}	2026-08-04 02:31:15.928089
c6d6b224-7f8a-4df4-95e9-892c53999043	03ec30d8-ec62-4645-bef9-8eef8a50a930	de5dc941-a1b2-4769-a6bc-8455560dfd4a	PROJECT_CREATED	{"projectName": "Backyard"}	2026-08-04 02:36:30.959142
caac168a-edd5-4534-9420-e81c5337dc1f	d48f9027-4956-400e-b0d4-b1e672d221a2	a73f39f4-168e-49f4-a1fa-69af642dce62	PROJECT_CREATED	{"projectName": "RoundAbout"}	2026-08-04 03:32:42.262635
0020bd11-a5c8-4575-a818-fc08510c3796	d48f9027-4956-400e-b0d4-b1e672d221a2	a73f39f4-168e-49f4-a1fa-69af642dce62	PROJECT_RENAMED	{"newProjectName": "Future Home", "oldProjectName": "RoundAbout"}	2026-08-04 03:50:52.198873
5033b84d-bf33-45d4-99b9-2f2cb789b048	d48f9027-4956-400e-b0d4-b1e672d221a2	a73f39f4-168e-49f4-a1fa-69af642dce62	MEMBER_ADDED	{"memberName": "paige", "projectName": "Future Home"}	2026-08-04 03:51:32.435093
adf183eb-2fd6-4933-850f-8b828b7973f4	03ec30d8-ec62-4645-bef9-8eef8a50a930	de5dc941-a1b2-4769-a6bc-8455560dfd4a	MEMBER_ADDED	{"memberName": "yuyu", "projectName": "Backyard"}	2026-08-04 04:47:36.527757
a158a2ba-7ed4-4f2b-929a-fd8504983088	03ec30d8-ec62-4645-bef9-8eef8a50a930	a73f39f4-168e-49f4-a1fa-69af642dce62	MEMBER_ADDED	{"memberName": "flora", "projectName": "Future Home"}	2026-08-04 04:52:20.38725
041b0b1e-2223-4740-bab6-6994f9fbebdd	0d276714-02e1-4341-a71f-6052e612f042	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	MEMBER_ADDED	{"memberName": "paige", "projectName": "Map"}	2026-08-04 08:04:41.764011
12628d54-cbf5-48cc-a287-bba46d69d669	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_ADDED	{"memberName": "flora", "projectName": "NSPU"}	2026-08-04 08:04:48.803551
2d0fe026-c3e5-4bbf-8ee1-721638220321	0d276714-02e1-4341-a71f-6052e612f042	46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	PROJECT_CREATED	{"projectName": "school"}	2026-08-04 08:15:32.760578
afeeaf91-9a83-4ebc-b24e-96ee78f88060	0d276714-02e1-4341-a71f-6052e612f042	46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	MEMBER_ADDED	{"memberName": "yuyu", "projectName": "school"}	2026-08-04 08:16:08.208247
1c8267f5-a502-49b4-b1ac-09950dbd11e9	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_ADDED	{"memberName": "thartti", "projectName": "NSPU"}	2026-08-04 08:16:18.262417
5b20ab9c-c38e-4ddd-b47a-d31ed06220d9	d48f9027-4956-400e-b0d4-b1e672d221a2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	MEMBER_DELETED	{"memberName": "thartti", "projectName": "NSPU"}	2026-08-04 08:16:26.969051
\.


--
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_categories (id, name) FROM stdin;
91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Rooms
b34fdc44-255f-4761-969d-c9a378321608	Walls
c868d700-4842-4f4d-9d4a-c7dccd6928d4	Furniture
e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Plants
d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Materials
\.


--
-- Data for Name: asset_subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_subcategories (id, category_id, name) FROM stdin;
4a796f18-58ab-46ee-9127-ccd187b0b066	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Kitchen
9c7b1ef0-2391-497a-a567-a75ca30d74d2	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Bathroom
9391a9cb-25d4-40d7-9362-c8b3a1099c75	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Dining Room
1cebcf27-b01f-4dff-87e9-3fe3f87f0a42	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Office
e43647cc-c24d-4dd0-abc8-a322973805d6	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	Outdoor Patio
54828d74-d9d0-47ce-bfc7-7be0006eeb5d	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Sofas
ab598574-ed4d-4487-a101-3e3ac37dccd7	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Chairs
f031d9d8-129f-4ad3-a7f1-949c060c813f	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Tables
cbfacb49-60b3-4b47-b7cd-cd13e01b89a8	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Shelves
272db613-16e3-426c-bc37-650f01bac085	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Desks
37a60e8e-d0c5-4874-af84-6c422fabf14f	c868d700-4842-4f4d-9d4a-c7dccd6928d4	Outdoor Furniture
3c4f28b6-d50a-4484-9f5d-be91eae0f6b2	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Indoor Plants
e8808533-057a-4c84-a492-7bfda3e61e92	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Trees
d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Shrubs
e3fa33a1-88a9-4d58-877e-5f429a94f1c6	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Flowers
9cad5523-3149-4a94-80ae-88b9942c2d25	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Succulents
8c955504-e0e4-4b44-8385-0f47e3d84c23	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Hanging Plants
18f697b5-dd33-4ea0-86d8-ff85a6a35158	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	Pots & Planters
c5134818-b01d-4ad3-af95-77129994df65	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Utility
31f82957-fa95-46dc-8946-36121038d02c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Play
83039c6e-8a40-433b-9344-e184db62b1ef	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Vehicle
47b8ad5a-0a6b-4386-a506-44d8134a8ede	b34fdc44-255f-4761-969d-c9a378321608	Brick Wall
c44242ff-0f48-4f79-be73-eaf1b48f40d5	b34fdc44-255f-4761-969d-c9a378321608	Wood Wall
4f1da2fb-be9b-4a22-a3f3-b33fb349b3ab	b34fdc44-255f-4761-969d-c9a378321608	Hedge Wall
bd752b20-dad7-4cc7-842e-6081c2a4ca89	b34fdc44-255f-4761-969d-c9a378321608	Fence
3d75505a-c2a5-4fe3-a55e-cd68e7ab7a16	b34fdc44-255f-4761-969d-c9a378321608	Gate
d6c72fc6-3349-4894-91bd-15afcb725eb4	b34fdc44-255f-4761-969d-c9a378321608	Partition
28b89844-18bc-47ec-8ae1-9e7121077754	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Road
536b78d5-1543-4d64-8433-2ad41f8edfb1	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Structures
bd70763e-f509-457c-a800-544b3f02535c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Stone
7d104e85-8bad-4626-81e8-53ecc737b115	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	Ground
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, category_id, subcategory_id, name, image_path, width, height, min_width, max_width, min_height, max_height, default_points, created_at) FROM stdin;
facd5b81-805f-48e4-9a9b-c8a6335e6c6d	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233055/lcgqg6kpap8sejvdi1mt.svg	100	100	40	300	300	300	\N	2026-07-28 23:33:27.758141
23cdff72-1e1b-42bb-9f89-7d127cbd5dcf	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233350/uoe7hafsrpxjngp8acdz.svg	100	100	40	300	300	300	\N	2026-07-28 23:38:24.00868
ba1dc357-dbdd-4d04-b7a9-20798d3c6457	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233384/hi2hqnfz14mygkopadpu.svg	100	100	40	300	300	300	\N	2026-07-28 23:38:51.503414
dedf41c3-f0ff-4003-936e-46f508f3f913	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233403/zueu9wlbivphnxv8kepu.svg	100	100	40	300	300	300	\N	2026-07-28 23:39:15.49639
2ec420aa-f08e-436e-b5a5-560b1a4556c1	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233423/rztpub5xg1t5pci406op.svg	100	100	40	300	300	300	\N	2026-07-28 23:39:32.989782
0ca611e2-a146-40e7-98d0-ae9b6b0ae510	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub7	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233439/fgccwmopg783yp99ndzo.svg	100	100	40	300	300	300	\N	2026-07-28 23:39:48.949175
26c55fe6-73fd-400d-81aa-131f711058ef	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub8	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233455/zo5ixlwydppg0abrjgiu.svg	100	100	40	300	300	300	\N	2026-07-28 23:40:07.241876
6848285e-7dbd-4ae6-aebe-3af0a5f6106e	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub9	https://res.cloudinary.com/ddalcxun8/image/upload/v1785233472/dkefqxgn4wcoc5dq5rew.svg	100	100	40	300	300	300	\N	2026-07-28 23:40:21.225001
af7da8f9-b13a-4d56-a61d-bafdf70a6326	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	stone1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785234026/btydcuqlnwy5wv9drpwf.svg	100	100	40	300	300	300	\N	2026-07-28 23:49:37.642581
4ed32e43-a96b-4357-b280-549957cb563c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	stone2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785234046/ahqyega26y5mopuakmll.svg	100	100	40	300	300	300	\N	2026-07-28 23:49:58.002703
6cb949ab-83e8-415f-8d2a-5f5e7c80fc63	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	stone3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785234065/es7voobda47yicopjokt.svg	100	100	40	300	300	300	\N	2026-07-28 23:50:16.610575
8446007f-725f-471a-9f24-595df4f82e90	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	stone4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785234081/imdudmhm358ykihrlzep.svg	100	100	40	300	300	300	\N	2026-07-28 23:50:31.855545
e812bd26-d8af-4cc0-9964-164f2828bb2c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313404/nuj9kkijtwlvgglhxtzr.svg	100	100	40	300	300	300	\N	2026-07-29 21:52:36.937125
cd4a6962-b54e-4582-b96d-ea9f1c723f09	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313425/ep5gtzs0tlis6thaoven.svg	100	100	40	300	300	300	\N	2026-07-29 21:52:59.894719
4f25c30d-51fe-4cd1-84d7-3c8268169a2c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313446/dp4pppyldkjlyebgczr0.svg	100	100	40	300	300	300	\N	2026-07-29 21:53:17.896863
e6bc09cf-213b-45f5-a98e-2dbec90cc289	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313464/xsjxjisdk8yrey0btcft.svg	100	100	40	300	300	300	\N	2026-07-29 21:53:37.236894
c0ce7552-64c5-4914-889a-d8f38a4661b6	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313486/zsq9enahtu0mizjotrow.svg	100	100	40	300	300	300	\N	2026-07-29 21:53:57.772909
0089fa9f-3925-4474-872b-9cc4b72597f5	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313502/g641ic1gehmf7ay7dhdo.svg	100	100	40	300	300	300	\N	2026-07-29 21:54:14.027541
af82008f-22d0-4c22-97ab-917cabd82136	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car7	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313519/thvetma6hlxnnnvhxfi3.svg	100	100	40	300	300	300	\N	2026-07-29 21:54:28.049109
80a86758-e15b-4b3a-a664-b6a5388a08aa	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	83039c6e-8a40-433b-9344-e184db62b1ef	car8	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313535/xcx7psh02v1lfkznu26d.svg	100	100	40	300	300	300	\N	2026-07-29 21:54:48.309177
a7d71805-b792-4972-959d-f926a2804636	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	chair1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313566/t7aavvzuho5azwypuclx.svg	100	100	40	300	300	300	\N	2026-07-29 21:55:13.147797
bf53c31b-3b37-4e07-b526-103cfdc9970c	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	chair2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313582/idda2yd6cpaqixkly3ax.svg	100	100	40	300	300	300	\N	2026-07-29 21:55:28.784037
128c8098-b5f1-4ea5-95d1-a75f8d97a310	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	chair3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313596/cn6mdkgbwakvb7sgayyc.svg	100	100	40	300	300	300	\N	2026-07-29 21:55:42.815726
468a7c05-00d8-4818-a5c2-645c821ef405	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	chair4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313609/ngqta7iadga7rci6nuj9.svg	100	100	40	300	300	300	\N	2026-07-29 21:55:56.957139
89f90a13-4bad-4a35-a0d5-9200d99c83ba	b34fdc44-255f-4761-969d-c9a378321608	bd752b20-dad7-4cc7-842e-6081c2a4ca89	fence1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313666/nmvwsas5rwemypq7d1e9.svg	100	100	40	300	300	300	\N	2026-07-29 21:56:52.944049
08043a57-2ff7-45a8-8ba2-bccbb963dc5e	b34fdc44-255f-4761-969d-c9a378321608	bd752b20-dad7-4cc7-842e-6081c2a4ca89	fence2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313678/zk22xoyntaxecbcm4hdm.svg	100	100	40	300	300	300	\N	2026-07-29 21:57:04.58794
0f3fd851-0f68-47b9-b05d-7f10015f6404	b34fdc44-255f-4761-969d-c9a378321608	bd752b20-dad7-4cc7-842e-6081c2a4ca89	fence3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313696/g52cgmamld057afgdx4f.svg	100	100	40	300	300	300	\N	2026-07-29 21:57:22.727908
4306f7ca-182f-449c-9e9d-f5f71e0378be	b34fdc44-255f-4761-969d-c9a378321608	bd752b20-dad7-4cc7-842e-6081c2a4ca89	fence4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313708/xwvrwv8cydyq58kh7tno.svg	100	100	40	300	300	300	\N	2026-07-29 21:57:35.263808
d79226f2-d436-4ad3-88ba-259230b07653	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e3fa33a1-88a9-4d58-877e-5f429a94f1c6	flower1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313781/ib5wl76qasbfy5hu0thz.svg	100	100	40	300	300	300	\N	2026-07-29 21:58:55.393105
54987efd-2fc9-4d34-b351-7b39030513c2	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e3fa33a1-88a9-4d58-877e-5f429a94f1c6	flower2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313805/kk75nch4rgwehxbobvud.svg	100	100	40	300	300	300	\N	2026-07-29 21:59:12.923375
5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e3fa33a1-88a9-4d58-877e-5f429a94f1c6	flower3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313818/r1zsnbnjzaiufz12j6ob.svg	100	100	40	300	300	300	\N	2026-07-29 21:59:33.819885
adad4019-7c1b-4940-9173-6ac22f24aa15	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e3fa33a1-88a9-4d58-877e-5f429a94f1c6	flower4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313840/i6dq62zddnxheypfadsq.svg	100	100	40	300	300	300	\N	2026-07-29 21:59:48.475432
1b3f5af0-8b4e-4e03-948b-6b927a5aa407	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e3fa33a1-88a9-4d58-877e-5f429a94f1c6	flower5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313899/zqsrk6fjugfird0abp8m.svg	100	100	40	300	300	300	\N	2026-07-29 22:00:57.113254
35b7f7b7-d237-4eeb-8c9b-5aa190111b43	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub10	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313952/jyqgyxbl6bh8jg6qz1mp.svg	100	100	40	300	300	300	\N	2026-07-29 22:01:47.798874
e0cebf35-352e-424c-84e8-bfc905fbf755	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub11	https://res.cloudinary.com/ddalcxun8/image/upload/v1785313973/mfrqvzuvx0ohjgver6un.svg	100	100	40	300	300	300	\N	2026-07-29 22:02:10.784653
4583035c-805b-4559-832f-11dd5e99320e	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub12	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314002/bt6vtrk1ej0wbtv128u4.svg	100	100	40	300	300	300	\N	2026-07-29 22:02:36.036844
bc7373a0-3425-4911-8a55-bf7c20e46bbe	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub13	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314025/dfridzags57qgg5xbrs9.svg	100	100	40	300	300	300	\N	2026-07-29 22:03:01.109394
1809dc7e-9c35-43c1-a71a-2a51842aeca1	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub15	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314049/siuegncy3d8ajscxh3fr.svg	100	100	40	300	300	300	\N	2026-07-29 22:03:16.24666
29fac494-b2dc-4a14-80b9-15df0ca3ef5d	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	shrub16	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314064/gfjucsmhbxyl7muhhu5z.svg	100	100	40	300	300	300	\N	2026-07-29 22:03:30.913783
da1681ad-0a24-4148-9f7c-009e9307549b	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314162/mx7mq8arcsfggy4ne65p.svg	100	100	40	300	300	300	\N	2026-07-29 22:05:15.343694
0f48ad40-c1f0-4e29-890c-0f3634ac9eb6	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314183/thqnoi7u67v0jthpukxk.svg	100	100	40	300	300	300	\N	2026-07-29 22:05:46.394235
8ff6ef69-a7f1-415c-8b50-6eb69030425b	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314214/yval5zepqbyvv1yjbjlp.svg	100	100	40	300	300	300	\N	2026-07-29 22:06:11.093505
4015b44b-f830-40cd-9204-65c9fa09f166	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314246/lr7mksrnogscwqj5iqmi.svg	100	100	40	300	300	300	\N	2026-07-29 22:07:15.402074
2e8d243e-849d-4ac6-89d2-9fbcea024082	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314306/imfhdvsprtxcuiyptqak.svg	100	100	40	300	300	300	\N	2026-07-29 22:07:37.599333
a62af0f6-57d9-4c37-80a6-f553e3133cdd	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314347/jn56an2zzx7pmrqjnlvr.svg	100	100	40	300	300	300	\N	2026-07-29 22:08:19.612938
6e823dbe-f90d-45c7-bba2-7bbce0ebae95	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree7	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314374/lleqg7mfdovfi6bltoh7.svg	100	100	40	300	300	300	\N	2026-07-29 22:08:46.580331
a4997dcc-65a4-477d-9189-6bbe87e13933	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	c5134818-b01d-4ad3-af95-77129994df65	board1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314454/dhxxpscquivmdimvkirn.svg	100	100	40	300	300	300	\N	2026-07-29 22:10:03.722898
5a8b21ad-f7f1-4734-8be7-2422364eeb47	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	rock	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314491/m2zyfoem22oqxnebvark.svg	100	100	40	300	300	300	\N	2026-07-29 22:10:47.759786
6782c64d-0d7d-492e-925c-4df1711eaf67	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pool1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314624/hcpimdkqg4quzvy3kfd7.svg	100	100	40	300	300	300	\N	2026-07-29 22:12:51.749819
9aa34528-cbb5-456b-ad82-40ca6c4a3caa	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pool2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314638/jcthrr4s92k9foc4zfxe.svg	100	100	40	300	300	300	\N	2026-07-29 22:13:06.675994
476737b4-e6c3-4f4f-8619-b93a5a3d9934	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pool3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314703/pizrap8rfsnz9piymxue.svg	100	100	40	300	300	300	\N	2026-07-29 22:14:10.886294
d9eba9d7-6d0a-44c7-91fd-8c4adf2eea05	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pool4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314719/hkwhtub50zampefq9l9q.svg	100	100	40	300	300	300	\N	2026-07-29 22:14:32.248664
bf91b575-68bb-4490-b68b-adb675eaf467	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pool5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314739/a6ydrlncqovxnx5qk4cw.svg	100	100	40	300	300	300	\N	2026-07-29 22:14:47.452114
f044f5d3-07e9-451e-be9f-d4017ba9d981	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	road1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785314992/gy8esmvayrsztddxb7gy.svg	100	100	40	300	300	300	\N	2026-07-29 22:19:00.541921
0dc39341-c1eb-4457-93f0-90fe871064a0	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	road2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315007/hwxh22x5pvnk8myoerv1.svg	100	100	40	300	300	300	\N	2026-07-29 22:19:15.736018
a7c31e21-c688-4894-8a40-c29152b49f94	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	road3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315026/h8hp6uylxwtuvk3uve56.svg	100	100	40	300	300	300	\N	2026-07-29 22:19:34.441938
a9cb2fa5-c1a8-493d-aa94-86c6a5ee1baf	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	roundabout	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315046/oam2rks2wgl4mko3bua1.svg	100	100	40	300	300	300	\N	2026-07-29 22:19:55.066121
ee633495-012c-4167-a16a-16ae8bc4f84e	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	bd70763e-f509-457c-a800-544b3f02535c	rock tree	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315092/dfujqvonicu8zortsnrb.svg	100	100	40	300	300	300	\N	2026-07-29 22:20:50.062594
c96ef31e-9483-42ae-b886-5de87a4a6461	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	path1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315453/rmbl1bp2gdsegcor6nwg.svg	100	100	40	300	300	300	\N	2026-07-29 22:26:52.888344
7b7dc063-2df8-4b71-ad68-9dc1d58c71ff	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	path2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315488/ksenjdrrl404i1znigmv.svg	100	100	40	300	300	300	\N	2026-07-29 22:27:15.083438
f0898e09-b787-47d4-97f9-954dfec7a76c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	path3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315542/fjld3rgawnkmrpfoiepn.svg	100	100	40	300	300	300	\N	2026-07-29 22:28:09.058446
3366eb93-6958-42bf-8786-27256c616384	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	path4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315558/acmycqslpda7ki3zqvpv.svg	100	100	40	300	300	300	\N	2026-07-29 22:28:27.148008
45236feb-b0c6-41a3-b601-c161cf0dd719	c868d700-4842-4f4d-9d4a-c7dccd6928d4	f031d9d8-129f-4ad3-a7f1-949c060c813f	table1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315585/uvwjpvrmilzupgesjnp8.svg	100	100	40	300	300	300	\N	2026-07-29 22:28:54.723206
2fd5a158-819e-4fc5-a7fe-f262231c7573	c868d700-4842-4f4d-9d4a-c7dccd6928d4	f031d9d8-129f-4ad3-a7f1-949c060c813f	table2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315599/fy2ttgztzljn1vqtv2hs.svg	100	100	40	300	300	300	\N	2026-07-29 22:29:07.287402
044658e0-08c7-497d-af5f-82d8f0d8f07c	c868d700-4842-4f4d-9d4a-c7dccd6928d4	f031d9d8-129f-4ad3-a7f1-949c060c813f	table3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315612/hcpnyoibnosloawyp8f9.svg	100	100	40	300	300	300	\N	2026-07-29 22:29:21.211982
add3fc8f-52f3-4c84-a04a-8b435bc92774	c868d700-4842-4f4d-9d4a-c7dccd6928d4	f031d9d8-129f-4ad3-a7f1-949c060c813f	table and chair	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315639/y0nrwumkmmkgalz5ctli.svg	100	100	40	300	300	300	\N	2026-07-29 22:29:46.662189
87e96664-05cc-418b-9226-4014745060a3	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	tennis	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315720/k9onidd5zcsxtt9bqkqd.svg	100	100	40	300	300	300	\N	2026-07-29 22:31:09.807052
ee82a325-cf22-4819-9b70-93a303550acd	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	Wooden Floor	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315934/wumf0hkrhiwjidjmlxz9.svg	100	100	40	300	300	300	\N	2026-07-29 22:34:45.046449
ea8269a6-a547-4f3a-8628-1ff2382097b0	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	floor1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785315974/ykwnsyivuolgnvor7qmv.svg	100	100	40	300	300	300	\N	2026-07-29 22:35:27.6347
ca27023a-ffda-4adb-9444-da5b94636c14	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316104/adpkwrdsw53b0ipvp5ha.svg	100	100	40	300	300	300	\N	2026-07-29 22:37:31.630031
2f421b84-3804-4139-aa0b-20742697821b	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316126/dg1w794kagpqzkawmpyy.svg	100	100	40	300	300	300	\N	2026-07-29 22:37:53.946455
e9a4c374-76e8-40f1-a139-2e05f89f3389	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316143/eetkafkjrokcuidbjziu.svg	100	100	40	300	300	300	\N	2026-07-29 22:38:09.709146
1e9f8d59-895a-4d04-8a0a-30dea9f0361f	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	c5134818-b01d-4ad3-af95-77129994df65	building4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316190/k286rjvxz00jobvwopfj.svg	100	100	40	300	300	300	\N	2026-07-29 22:38:57.505177
15f7f422-b638-4812-af5c-76fd859634ce	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316211/btx5qkjxgohhh9r0avth.svg	100	100	40	300	300	300	\N	2026-07-29 22:39:17.976885
936109c7-becc-41a5-acf1-25465cec28ac	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316264/hsgsr7jpx8mboobv9jvf.svg	100	100	40	300	300	300	\N	2026-07-29 22:40:13.011139
44d45ada-7c3b-4bb6-b931-3e7801b6aab7	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	pond1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316318/zedp9ozk7kebkel4khp5.svg	100	100	40	300	300	300	\N	2026-07-29 22:41:45.65923
1ff34f29-0440-490a-a836-92dc44d8f7c6	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	corner1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785316388/hecx7fozni47sm4uqdkk.svg	100	100	40	300	300	300	\N	2026-07-29 22:42:27.261299
fc6048e0-3920-4c6d-b668-12e88e8a1b23	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Ayeyarwaddy	https://res.cloudinary.com/ddalcxun8/image/upload/v1785739810/nonfpgltiaxhlqtl18so.svg	100	100	40	300	300	300	\N	2026-08-03 06:50:12.449504
7d0b578c-85b4-40f1-8599-65a073797178	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Kachin	https://res.cloudinary.com/ddalcxun8/image/upload/v1785739947/aerqnmkb5zes5ekcsyxb.svg	100	100	40	300	300	300	\N	2026-08-03 06:52:30.032116
a49fb73f-2a2c-4243-9bdc-0f578bd66ec2	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Kayah	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740051/rzpbj96ixdh950wtic5y.svg	100	100	40	300	300	300	\N	2026-08-03 06:54:13.312275
2dd21ba6-711b-45df-9466-cc2c98361d52	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Kayin	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740183/nepsfs9yhxzd6vubmzju.svg	100	100	40	300	300	300	\N	2026-08-03 06:56:25.944987
1c9f46fd-f251-4e2d-8bda-9292e3dff732	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Chin	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740276/tannpgoytnbr3ykfyxxs.svg	100	100	40	300	300	300	\N	2026-08-03 06:57:58.877809
057535ec-ebab-4f90-bc0c-07e511459d49	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Mon	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740399/trotbvragrv5qnbyhv42.svg	100	100	40	300	300	300	\N	2026-08-03 07:00:01.791973
f2830d68-0b4f-4438-ac83-0cd76b703041	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Rakhine	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740462/ahohfdyidxykaaqwlrds.svg	100	100	40	300	300	300	\N	2026-08-03 07:01:06.136787
f13398e8-a692-4456-ada6-544107b208b6	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Shan	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740570/ezug3qlnlsjhndrmkc06.svg	100	100	40	300	300	300	\N	2026-08-03 07:02:52.342417
2f988be1-4435-48d7-ad7f-4c0aa0ed23ad	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Bago	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740659/qjda1yfwnwjljltc3izm.svg	100	100	40	300	300	300	\N	2026-08-03 07:04:22.449207
a2d5d3bc-01f8-41f7-91cf-abce2fa19791	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Magway	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740712/tp2b0vl2ccmp4ihkxrmt.svg	100	100	40	300	300	300	\N	2026-08-03 07:05:15.329816
bbea6c9d-16a5-4e94-b845-ddaca0cbecbe	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Mandalay	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740833/a4v2yxmpiofz1yfublyb.svg	100	100	40	300	300	300	\N	2026-08-03 07:07:16.286324
153e5460-3a72-4f0c-9ff6-a20079f3f863	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Mon	https://res.cloudinary.com/ddalcxun8/image/upload/v1785740881/mkglpjyfd0sthxlqspj0.svg	100	100	40	300	300	300	\N	2026-08-03 07:08:02.85953
7e370f45-a5f5-4365-ac4c-f39e3cd28cb5	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Sagaing	https://res.cloudinary.com/ddalcxun8/image/upload/v1785741014/gpsxyt965zzkj68qihgz.svg	100	100	40	300	300	300	\N	2026-08-03 07:10:16.11816
fa335473-f0aa-440d-80ae-d4e11a287625	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Tanintharyi	https://res.cloudinary.com/ddalcxun8/image/upload/v1785741078/yh93dsykmgggtk2lz3wt.svg	100	100	40	300	300	300	\N	2026-08-03 07:11:20.605858
0d982269-9076-49e0-b4b9-2ac5990f8eb4	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Yangon	https://res.cloudinary.com/ddalcxun8/image/upload/v1785741181/hwmymazztydsb8lro53x.svg	100	100	40	300	300	300	\N	2026-08-03 07:13:03.218409
d14fa285-f3df-44ce-b8fb-75d500df54b0	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Building41	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742024/zxei4x2qd4e75ze0agic.svg	100	100	40	300	300	300	\N	2026-08-03 07:27:06.829477
513dd962-e624-4fbf-9c02-592a4828143f	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	Baseball	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742065/wn2thpei7gsvvfvdsjmx.svg	100	100	40	300	300	300	\N	2026-08-03 07:27:53.105317
ae18ea4a-8e96-4e80-a201-90211e87330f	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	Basketball	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742102/ts1cbeur1seww4rdgzpc.svg	100	100	40	300	300	300	\N	2026-08-03 07:28:27.73661
50e0462e-ed3f-4430-abe8-8ce2572abe18	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	e8808533-057a-4c84-a492-7bfda3e61e92	tree11	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742137/qeljk7uwbkfitusxrmro.svg	100	100	40	300	300	300	\N	2026-08-03 07:29:01.016887
9f101fee-8405-480c-af6b-2df04c6eae7d	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	31f82957-fa95-46dc-8946-36121038d02c	football	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742180/yivhnoivymqhlru8bydl.svg	100	100	40	300	300	300	\N	2026-08-03 07:29:48.23924
6019ce3f-9a82-4894-a3ab-b4505410c0a4	e8a50583-6d7a-4f16-86b2-dfbb2d57c8b8	d3eb2be3-bb0c-44ab-a432-67e7f2c0b8f0	bush18	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742219/f9l6vjsi5lvxrn7iyswb.svg	100	100	40	300	300	300	\N	2026-08-03 07:30:26.723631
df5020ab-908a-44ae-8bcc-2b5f83ec1dee	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	bench7	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742310/wpqyaginvpaepduvhh0d.svg	100	100	40	300	300	300	\N	2026-08-03 07:31:58.670215
ce0393de-c8a1-451c-8474-34f9f8ca5492	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	bench5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742341/dhdrbsdo7g5fmpbm9dbr.svg	100	100	40	300	300	300	\N	2026-08-03 07:32:23.389869
6f77593e-1547-4ad7-b585-84f019c8afd1	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	bench6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742362/qrdkqfeujjhxk6bm0no3.svg	100	100	40	300	300	300	\N	2026-08-03 07:32:48.955293
b1f57d82-7b2f-4e14-b025-8696f69f8149	c868d700-4842-4f4d-9d4a-c7dccd6928d4	ab598574-ed4d-4487-a101-3e3ac37dccd7	bench4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742390/nyktlusg3j32h0kf9xvy.svg	100	100	40	300	300	300	\N	2026-08-03 07:33:13.634988
f79c90a7-3a35-4953-bc6b-b0743ec8dd95	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building37	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742481/gxjo6wdq9r3dqmkvkpnd.svg	100	100	40	300	300	300	\N	2026-08-03 07:34:44.156391
334f3b9e-e388-4baf-a553-0323f165f921	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building38	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742509/u7nu6ledojgdkkqbnftm.svg	100	100	40	300	300	300	\N	2026-08-03 07:35:14.010178
f5fa6f0d-b7ae-4a6f-92da-50bdce0c665a	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building39	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742532/vxudeeyqjcgehsuwss50.svg	100	100	40	300	300	300	\N	2026-08-03 07:35:35.077541
6d1e4780-bd86-4144-9cc7-4fa4584f5039	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building40	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742554/p3f6euceedyona3s8eqh.svg	100	100	40	300	300	300	\N	2026-08-03 07:36:05.979158
652d310d-59e3-46a4-bf8e-c190366d1e79	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	c5134818-b01d-4ad3-af95-77129994df65	build	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742591/lrpl328ncwzmzx4piczk.svg	100	100	40	300	300	300	\N	2026-08-03 07:36:34.856937
e9867ac2-69cb-4795-8996-834d17cd523b	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building33	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742653/ydyx6gcs1ahdcdxyzyfp.svg	100	100	40	300	300	300	\N	2026-08-03 07:37:35.582512
ca324297-c987-49d8-a70d-5e5483bf32ba	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building33_1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742675/g6bq7dwueqv4xo6ap617.svg	100	100	40	300	300	300	\N	2026-08-03 07:37:59.849093
70030b05-b527-4c7d-9c65-6ab95a847715	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building34	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742711/hdntqrw6nmi0sfbixidb.svg	100	100	40	300	300	300	\N	2026-08-03 07:38:34.437159
97e6f1d8-f6bd-400f-8a7e-786845873b4c	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	building35	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742734/ssqjc8gxiq9hvsycazuy.svg	100	100	40	300	300	300	\N	2026-08-03 07:38:57.738911
3bbfc022-f634-4063-bad3-225749cfd38e	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	shop1	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742771/tc1uvhehqryineah5iw3.svg	100	100	40	300	300	300	\N	2026-08-03 07:39:36.839081
117fb652-8cab-44b8-a458-4e097577cae2	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	shop2	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742811/bemi23krh6jcwtqvdpxd.svg	100	100	40	300	300	300	\N	2026-08-03 07:40:16.145037
81a8b403-a7e7-457a-b327-4b77a84ca2ce	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	shop3	https://res.cloudinary.com/ddalcxun8/image/upload/v1785742850/xhyrq0rdmt9bkywwzie5.svg	100	100	40	300	300	300	\N	2026-08-03 07:41:01.612998
850832c2-bca3-4505-a92f-739b9034b6cd	c868d700-4842-4f4d-9d4a-c7dccd6928d4	37a60e8e-d0c5-4874-af84-6c422fabf14f	pool8	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743006/jpzxyewdyimwiutd0aej.svg	100	100	40	300	300	300	\N	2026-08-03 07:43:36.350892
caa76522-3ee9-40c2-b2f1-71c73bdecc4e	c868d700-4842-4f4d-9d4a-c7dccd6928d4	37a60e8e-d0c5-4874-af84-6c422fabf14f	pool9	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743057/j1unjvrmilbgf7fb0jxa.svg	100	100	40	300	300	300	\N	2026-08-03 07:44:30.271258
d0f34643-f3b7-40fa-b66f-28ae1e64e0bd	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain8	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743228/pmntaorx5rs287d0p0yx.svg	100	100	40	300	300	300	\N	2026-08-03 07:47:12.915908
781ca3bb-3f11-4a85-95cb-9830ed1dc95a	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain9	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743300/vmhkqwajx0efzvzf1nfu.svg	100	100	40	300	300	300	\N	2026-08-03 07:48:23.476306
7b2f5d1d-b285-43f5-b616-cbe11099f6c6	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain9	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743334/m81dkmtakutltlib7egq.svg	100	100	40	300	300	300	\N	2026-08-03 07:48:56.880782
6ec06eb7-4117-438c-b05a-b98f3c323cfd	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain11	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743531/dbjd0yfxkzyezygg429q.svg	100	100	40	300	300	300	\N	2026-08-03 07:52:12.955
d1c6c2c0-564b-49ff-a76c-c7ceeb8b718a	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain12	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743581/fngtgaipezmpjhdvoyeq.svg	100	100	40	300	300	300	\N	2026-08-03 07:53:04.372135
0ebe4655-d6d2-46c8-b6a6-60e5fbedf496	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	terrain13	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743631/gfrl8fgcoixgstkm7bii.svg	100	100	40	300	300	300	\N	2026-08-03 07:53:54.938107
f971fe65-f17c-45e6-bc46-572c23e4fd07	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain13	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743694/daftcmbf9wgmjcgahgua.svg	100	100	40	300	300	300	\N	2026-08-03 07:54:57.627425
a67922da-ba0f-4abc-b4b7-ce26aff05c24	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain14	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743763/ryfaspah0raonp77zdeo.svg	100	100	40	300	300	300	\N	2026-08-03 07:56:06.333131
345105dd-7a6d-465d-bf36-fcbae8ff5b6d	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	terrain15	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743801/ijj6rfraueqaepxlfxog.svg	100	100	40	300	300	300	\N	2026-08-03 07:56:45.103446
4180a47f-d235-4832-b0ec-43137e086c34	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	1cebcf27-b01f-4dff-87e9-3fe3f87f0a42	room	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743855/r1vpgcignahizstmu2rb.svg	100	100	40	300	300	300	\N	2026-08-03 07:57:38.383723
fd6e39cc-0b43-4ca2-837d-5010e23bc62b	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	7d104e85-8bad-4626-81e8-53ecc737b115	Terrain7	https://res.cloudinary.com/ddalcxun8/image/upload/v1785743980/rt2uuzlj4uuq7zg7vr3q.svg	100	100	40	300	300	300	\N	2026-08-03 07:59:45.779891
f4910bc9-987a-46f6-a40c-2ebace3756a2	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	terrain5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744050/mh0pqcp9xtbrqqidrxwk.svg	100	100	40	300	300	300	\N	2026-08-03 08:00:55.51868
1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	Terrain6	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744247/kojbhsvzcjhlevjip2tx.svg	100	100	40	300	300	300	\N	2026-08-03 08:04:11.119981
d310081a-022f-4fb1-93c7-1a512f391103	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	Terrain4	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744298/opexiha73igjf774esdv.svg	100	100	40	300	300	300	\N	2026-08-03 08:05:04.349621
b9ea224c-9329-4bf8-94da-7ae8805eb846	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	rectangle	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744462/nyustlmibrbbhm1ipba0.svg	100	100	40	300	300	300	\N	2026-08-03 08:07:45.126327
8d87126b-5d65-401a-ba16-51073bcf4933	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	ushape	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744501/bvysc3j3fxkk8bvq9znc.svg	100	100	40	300	300	300	\N	2026-08-03 08:08:23.518961
2a7ae5d1-1234-4374-a78f-e190679193af	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	polyshape	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744528/g9pwb7ivmjpzjewtv2r5.svg	100	100	40	300	300	300	\N	2026-08-03 08:08:51.069119
c55c31a5-4941-4dd6-9c3d-6febacf88818	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	eclipse_shape	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744567/aahablf7fvrdawt65zud.svg	100	100	40	300	300	300	\N	2026-08-03 08:09:28.958965
37b1a3b7-fea1-43a3-8db3-daf046a0d8d2	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	zxy_shape	https://res.cloudinary.com/ddalcxun8/image/upload/v1785744602/gtlwtpehxcilvxqysct1.svg	100	100	40	300	300	300	\N	2026-08-03 08:10:04.391589
4a7ae495-95b2-464b-8bc1-8d48ac136213	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	28b89844-18bc-47ec-8ae1-9e7121077754	school_roundabout	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745070/bmo8hhneicqfs7odovvd.svg	100	100	40	300	300	300	\N	2026-08-03 08:17:53.798578
660e113e-63c0-4c4b-8225-776bf832a7f4	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	school_canteen	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745120/i6wtaosawe3tr4mlqylx.svg	100	100	40	300	300	300	\N	2026-08-03 08:18:42.367665
df00dd36-4eb2-4e73-b854-90f3ef4ea1bc	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	girl	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745167/wwnw9tbe6cblbnraasnr.svg	100	100	40	300	300	300	\N	2026-08-03 08:19:29.956562
01cdeb83-10f4-407b-9604-a1d9a27bf1a8	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	school_prof	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745199/viqapcpnqdq9kftxruth.svg	100	100	40	300	300	300	\N	2026-08-03 08:20:03.646463
c69788ec-e49c-43c2-9594-2aa4cfd3dfc7	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	work	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745304/edcvkj69cgoozigs7glv.svg	100	100	40	300	300	300	\N	2026-08-03 08:21:49.219996
e4ea751e-9a13-4cc1-a692-27b751a059f5	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	School_boyhostel	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745875/jvii5mvy72c8eyxxdew4.svg	100	100	40	300	300	300	\N	2026-08-03 08:31:18.885541
b9a84779-4496-4194-8f9c-88edd01dd7d7	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	school_mainbuilding	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745941/hluyjgg3cgvs9tzvnxnu.svg	100	100	40	300	300	300	\N	2026-08-03 08:32:23.068247
2392522b-487a-4d81-87ac-98b449349ec9	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	school_RC	https://res.cloudinary.com/ddalcxun8/image/upload/v1785745969/q1bdiujpfjgntv8yyej2.svg	100	100	40	300	300	300	\N	2026-08-03 08:32:52.476928
587795f2-8ed0-4c1a-960c-ecf7fae02d29	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	school_Bridgenpool	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746002/l6new9e1rulp92mw1qjp.svg	100	100	40	300	300	300	\N	2026-08-03 08:33:24.744738
148fba3c-ad55-45ff-9bdf-b4425459e662	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	footballStand	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746050/yrdp6vo3rjoi8ffgdtk6.svg	100	100	40	300	300	300	\N	2026-08-03 08:34:12.960841
4204e5d8-9b07-4c50-8c37-186bfaf5dad8	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Mpool	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746078/e3mvigatgnno989sxt0o.svg	100	100	40	300	300	300	\N	2026-08-03 08:34:40.100343
a9ddd708-2baf-4c7e-a508-b5828cda661d	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	Mya_outline	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746127/hq4jgrnfk1phwp9jxeec.svg	100	100	40	300	300	300	\N	2026-08-03 08:35:29.138047
64a99ff0-e159-40fb-bafc-2d641b0cd7d0	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	square	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746862/tbokqwvfp6uq72wezokh.svg	100	100	40	300	300	300	\N	2026-08-03 08:47:45.020039
cce2a71d-e79f-44f7-82d7-f49ca16591b7	91ca60ae-adf6-42d5-bcc6-70f65acf47f3	e43647cc-c24d-4dd0-abc8-a322973805d6	shape5	https://res.cloudinary.com/ddalcxun8/image/upload/v1785746925/rphmaqzquuqkzas0lahu.svg	100	100	40	300	300	300	\N	2026-08-03 08:48:48.081585
aa043cb2-f4ab-4651-9614-6a16a386e343	d189aa91-1411-4d9f-833d-aeb35b9dd9d3	536b78d5-1543-4d64-8433-2ad41f8edfb1	prof	https://res.cloudinary.com/ddalcxun8/image/upload/v1785748346/usbxulwue32isqsqnkri.svg	100	100	40	300	300	300	\N	2026-08-03 09:12:28.210398
b7bd267c-393b-43c2-b4ad-efc20bc48f01	c868d700-4842-4f4d-9d4a-c7dccd6928d4	54828d74-d9d0-47ce-bfc7-7be0006eeb5d	newItem	https://res.cloudinary.com/ddalcxun8/image/upload/v1785831308/ymwe59kunqpcay5zq979.svg	100	100	40	300	300	300	\N	2026-08-04 08:13:18.939173
c473143d-1b45-4cd2-975c-3e99358a51f9	c868d700-4842-4f4d-9d4a-c7dccd6928d4	54828d74-d9d0-47ce-bfc7-7be0006eeb5d	awe	https://res.cloudinary.com/ddalcxun8/image/upload/v1785831316/d3bayfre182pxamqfrwn.svg	100	100	40	300	300	300	\N	2026-08-04 08:13:27.084415
7a747c85-27b7-470b-ad11-0ef88a59885e	c868d700-4842-4f4d-9d4a-c7dccd6928d4	54828d74-d9d0-47ce-bfc7-7be0006eeb5d	hhh	https://res.cloudinary.com/ddalcxun8/image/upload/v1785831370/smyoyvojms2l3vvds6tt.svg	100	100	40	300	300	300	\N	2026-08-04 08:14:19.67409
\.


--
-- Data for Name: placed_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.placed_items (id, project_id, asset_id, x, y, width, height, rotation, z_index, points, color, created_at) FROM stdin;
5d7e7cec-a316-44dd-a98e-f9620e05c7c3	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	a9ddd708-2baf-4c7e-a508-b5828cda661d	783	222	578.9999999999997	837.9999999999993	0	1	\N	\N	2026-08-04 08:10:30.877794
e97b23e2-df14-4fca-9e1c-256c3ef66fe1	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	7d0b578c-85b4-40f1-8599-65a073797178	817.7557897218267	-81.27306985919762	189.23530326025144	230.2353032602527	0	2	\N	\N	2026-08-04 08:10:30.877794
4ec0aa85-ada5-40a4-a2c6-2c16706d7902	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	a49fb73f-2a2c-4243-9bdc-0f578bd66ec2	826.21928354507	227.92254188499322	70.6556345842074	67.65563458420729	0	3	\N	\N	2026-08-04 08:10:30.877794
85d2a9e7-03e4-4aaa-9364-52a4216e5ad7	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	2dd21ba6-711b-45df-9466-cc2c98361d52	850.2313809247823	315.72005540762007	180.69729557800756	181.74848156898108	3.013352466368462	4	\N	\N	2026-08-04 08:10:30.877794
0ef97933-3377-436f-a106-c5b449da30cb	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	1c9f46fd-f251-4e2d-8bda-9292e3dff732	569.2752831652144	90.37000775810594	103.99999999999947	158.00000000000028	0	16	\N	\N	2026-08-04 08:10:30.877794
0de838e1-1fe9-4b62-beab-d67181764fb6	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	057535ec-ebab-4f90-bc0c-07e511459d49	828.4339124871688	351.05287020245476	105.99381124126073	120.00000000000048	4.161247237280359	6	\N	\N	2026-08-04 08:10:30.877794
eee5888c-3983-438c-bd7f-96dcec20bc8f	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	f2830d68-0b4f-4438-ac83-0cd76b703041	585.641381064848	223.21684554905954	186.73295126785374	175.57041981629035	3.1507551150358193	15	\N	\N	2026-08-04 08:10:30.877794
e9facbf5-351f-4265-a2c1-5030d613c965	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	f13398e8-a692-4456-ada6-544107b208b6	911.0420757018253	116.81711061249655	325.16400996236547	221.16400996236672	0	8	\N	\N	2026-08-04 08:10:30.877794
3eea80e8-7352-44ad-97a8-6342636efb4d	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	0d982269-9076-49e0-b4b9-2ac5990f8eb4	757.2663997905404	328.0276255470642	70.0730303657162	67.54761264535894	0	9	\N	\N	2026-08-04 08:10:30.877794
bbd76bf4-079f-4daa-b011-f9ae2a4187e8	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	7e370f45-a5f5-4365-ac4c-f39e3cd28cb5	713.2045572524279	-20.15580888352423	206.17882592795345	267.88949739431024	0	10	\N	\N	2026-08-04 08:10:30.877794
2ea4f56a-a0b2-4903-9def-ac5aba3b87f2	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	bbea6c9d-16a5-4e94-b845-ddaca0cbecbe	723.4002522275098	117.29606471175134	160.6363895126272	213.35324064045727	0	17	\N	\N	2026-08-04 08:10:30.877794
3ab28ef6-711b-47b4-9f47-f842bbc49dc2	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	a2d5d3bc-01f8-41f7-91cf-abce2fa19791	679.5484319708233	170.8569638310866	183.75086878837743	188.84178378691763	5.14276455788309	14	\N	\N	2026-08-04 08:10:30.877794
7ca4e7af-adc6-4e2a-bf25-f672122a7d38	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	2f988be1-4435-48d7-ad7f-4c0aa0ed23ad	740.2655143940094	281.6230869298535	151.7500017975334	121.70892017432445	0	18	\N	\N	2026-08-04 08:10:30.877794
555465e0-aaef-454a-b8ce-f4ec71d4ca77	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	fa335473-f0aa-440d-80ae-d4e11a287625	915.4967804066598	525.0922714924465	143.06418777713864	217.8956489584708	3.9757118008965833	19	\N	\N	2026-08-04 08:10:30.877794
0c140d03-a275-4aa4-a9af-0815edd4674a	3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	fc6048e0-3920-4c6d-b668-12e88e8a1b23	687.7972041104044	328.01338484721305	121.00450441310927	120.00450441310943	0	20	\N	\N	2026-08-04 08:10:30.877794
085dd892-cf09-4ed6-a926-e909519f55c4	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	f044f5d3-07e9-451e-be9f-d4017ba9d981	1759.5507806998055	601.0433020057727	99.99999999999834	100.00000000000057	90.43883401959773	16	\N	\N	2026-08-10 15:43:36.160007
0742f325-44df-46ca-aa62-a8632572625c	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	944.9937503123498	-148.2563924688273	361.9591247533333	193.87631466506312	0	-15	\N	\N	2026-08-10 15:43:36.160007
1a12e6af-a8e4-4bd8-aa31-885f7830b5d9	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	1035.8011219158727	766.1358054692448	38.971473311318256	38.97147331131802	0	49	\N	\N	2026-08-10 15:43:36.160007
475df094-83c9-4654-a870-9a0661994b41	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1071.8133652162137	656.7912932359375	24.523898081940562	24.523898081940406	0	59	\N	\N	2026-08-10 15:43:36.160007
1d1a8dae-030f-4208-b6d6-5a5e9de071e7	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	587795f2-8ed0-4c1a-960c-ecf7fae02d29	638.5333357690879	317.70183841429247	298.76058136579354	275.9326646528835	0	9	\N	\N	2026-08-10 15:43:36.160007
5b509981-6eef-4a10-886e-2a2ce74fe693	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6848285e-7dbd-4ae6-aebe-3af0a5f6106e	1628.3783522613487	818.9383027285928	226.334815973259	226.3348159732574	0	66	\N	\N	2026-08-10 15:43:36.160007
0a452510-41e2-4974-9e00-d7162405c715	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	221.50050582373478	773.0119173099268	464.52208205301577	464.52208205301395	0	-9	\N	\N	2026-08-10 15:43:36.160007
102b7b7c-7908-4d1e-9288-bd62e0638b71	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	e4ea751e-9a13-4cc1-a692-27b751a059f5	272.66470872659687	27.231728321308104	391.30409867130345	391.3040986713038	0	23	\N	\N	2026-08-10 15:43:36.160007
1bdcc610-38bb-44c4-861c-14572cbfd14d	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	237.3511216013298	1102.4525134451085	126.21800500290267	707.4950859005146	-89.55677313579712	26	\N	\N	2026-08-10 15:43:36.160007
23516831-adcc-489a-b452-8a017d4b6352	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	9f101fee-8405-480c-af6b-2df04c6eae7d	-499.2891254810911	684.0626020311474	720.2763344727173	483.8778255334141	0	30	\N	\N	2026-08-10 15:43:36.160007
31de2a1e-71db-4263-bbc6-65d4a31a500e	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-521.9834962523774	1099.8789187993414	130.6217213124743	1223.3839593106172	-89.72435986409796	34	\N	\N	2026-08-10 15:43:36.160007
0347803b-faad-4ae4-935d-9bf246608037	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1386.7518266537766	-40.36487418413557	79.94887095679036	474.5220068910305	0	-13	\N	\N	2026-08-10 15:43:36.160007
0b1117e2-fa80-43f9-a3f2-ffc8bc750063	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	add3fc8f-52f3-4c84-a04a-8b435bc92774	946.9009858695133	-147.31568029794175	100	100	0	40	\N	\N	2026-08-10 15:43:36.160007
631c2e25-748b-4bd1-8f12-fd4c32d7f2f6	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	1197.0723871229377	793.5783744603053	535.3669480385902	546.4463330511469	0	-5	\N	\N	2026-08-10 15:43:36.160007
2aed8699-20bc-4cef-b563-a908817c33a5	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	864.607419589111	578.4220381198024	203.74915702525814	124.89086896607033	0	-6	\N	\N	2026-08-10 15:43:36.160007
5577cfbf-1c05-4ad7-95b7-728cc4ee9bbd	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1271.663779135864	509.01142709967314	146.9915294639439	1164.8090731570333	-89.55677313579712	12	\N	\N	2026-08-10 15:43:36.160007
41d55fe1-61d1-47e9-b3f0-00c70b29e069	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	671.9487784451873	507.0422830469349	126.21800500290826	553.2662378348153	-89.55677313579712	13	\N	\N	2026-08-10 15:43:36.160007
30b1598d-e250-4d09-89b2-741bdaedf7f7	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	cd4a6962-b54e-4582-b96d-ea9f1c723f09	766.1995829448159	465.13649628594703	13.37053810020839	21.32153437553012	-91.5491410348259	6	\N	\N	2026-08-10 15:43:36.160007
174b103a-e3bb-4432-8396-17e36183f4b4	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	659.2577394258187	774.6022864798992	355.6980205469384	464.5220820530133	0	-7	\N	\N	2026-08-10 15:43:36.160007
028d6aac-c1d5-4cb3-b2c4-93b41d7152b6	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1457.5499844675544	94.21870901803766	90.9155196566484	225.80419755165312	-89.55677313579712	39	\N	\N	2026-08-10 15:43:36.160007
5585276c-202b-4cff-8494-6e52a05904b3	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	873.3846072160521	716.6808527393525	38.05056694651451	38.050566946514785	0	45	\N	\N	2026-08-10 15:43:36.160007
334c2b1b-e0bc-4b98-8e13-dcae4a30a611	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1142.4174774605212	553.9864947441426	24.523898081940562	24.523898081940406	0	54	\N	\N	2026-08-10 15:43:36.160007
23982a75-c7e6-4354-9b86-1d867ab3fd11	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1100.8090827201877	637.5884949891595	24.523898081940562	24.523898081940406	0	57	\N	\N	2026-08-10 15:43:36.160007
00d9d365-a0d1-4e84-b4c4-379aef738e52	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-945.1706295891868	653.9477390996922	152.16066071623393	1115.4758070212793	0	33	\N	\N	2026-08-10 15:43:36.160007
010a30cb-ce77-44cc-abdb-29e88e4cdb1c	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1218.2576505484171	-207.25434385040884	79.94887095679073	474.5220068910373	90	-14	\N	\N	2026-08-10 15:43:36.160007
006f18e7-b1f0-4e17-a6cf-22a73a41fa97	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1456.7490779092157	510.09413104260466	146.9915294639439	1164.8090731570333	-89.55677313579712	12	\N	\N	2026-08-10 15:43:36.160007
a917dbcf-2032-481e-8cf0-fb5d7683c785	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4204e5d8-9b07-4c50-8c37-186bfaf5dad8	1044.518957480765	601.5619723145026	237.21682543943473	237.21682543943436	-89.65496349733978	7	\N	\N	2026-08-10 15:43:36.160007
00f25289-cf5f-4ef8-9a25-8c1c8d1cbaa1	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1043.9791794186447	576.3857079258792	163.9537162866614	113.33735391292952	0	-4	\N	\N	2026-08-10 15:43:36.160007
03f36f58-1263-4545-8b7c-e3a1dda3fc5e	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-176.55389531767216	113.56462776171486	92.05874421507427	259.87515031615345	0	-11	\N	\N	2026-08-10 15:43:36.160007
26e814b8-5430-4a5d-bfe1-980f1a59ea76	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-410.55181140749414	-39.706133758110525	152.16066071622797	654.86359145093	0	-12	\N	\N	2026-08-10 15:43:36.160007
0c38b90e-a444-42db-b90c-ccaaab5defc1	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	876.1530749575014	719.210938420116	38.05056694651451	38.050566946514785	0	45	\N	\N	2026-08-10 15:43:36.160007
369c47a9-4ffa-4686-b7d2-53fe794a13fe	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1119.5760145140052	611.6629091469696	24.523898081940562	24.523898081940406	0	56	\N	\N	2026-08-10 15:43:36.160007
16b727ae-e238-417a-b724-e53f7d2d36ea	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	475.0500418754008	324.75149141967006	152.1606607162259	1130.6547689877573	0	21	\N	\N	2026-08-10 15:43:36.160007
123d1045-bf1c-4589-97c6-e33de89f20f0	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	148fba3c-ad55-45ff-9bdf-b4425459e662	-486.5849963461581	1000.5030689783698	705.7979940195977	239.92116008258168	0	31	\N	\N	2026-08-10 15:43:36.160007
22114567-9712-4f1b-9c4a-53a055cb5cf5	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	50e0462e-ed3f-4430-abe8-8ce2572abe18	640.6485559952863	895.144664775223	100	100	0	44	\N	\N	2026-08-10 15:43:36.160007
2e17767f-8888-4f4d-a922-2a0d0cdaae96	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	811.2338792975621	651.5562422968441	23.97049836359445	-23.970498363594043	-180	55	\N	\N	2026-08-10 15:43:36.160007
0539835f-7ae2-4c6f-9c57-9a700bf01b8a	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	774.3316904333361	610.2880243892986	24.523898081940562	24.523898081940406	0	58	\N	\N	2026-08-10 15:43:36.160007
02d80c2c-aa30-4eee-ad90-98c55207c177	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4a7ae495-95b2-464b-8bc1-8d48ac136213	941.8170812286053	513.8251635662857	68.72044819411545	68.72044819411546	0	2	\N	\N	2026-08-10 15:43:36.160007
27ebf978-d95a-4f0f-b39b-d66f72cea20b	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6782c64d-0d7d-492e-925c-4df1711eaf67	940.0315576772273	431.7669705351334	174.99983072513658	51.90876453788869	0	-1	\N	\N	2026-08-10 15:43:36.160007
15ec7515-c90f-4d48-a674-ff82ef06f25b	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-49.94031240057703	626.0526953827914	152.16066071623393	1115.4758070212793	0	25	\N	\N	2026-08-10 15:43:36.160007
182c4bfe-1675-46c1-b3c4-74c24eb42257	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	aa043cb2-f4ab-4651-9614-6a16a386e343	1530.1974119742329	3.2907258962328	187.16648413009452	187.1664841300948	0	38	\N	\N	2026-08-10 15:43:36.160007
1f3c395b-4a65-4174-87fb-7910ed6ad6fc	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1022.797735154553	583.1252583735446	247.39576944823477	124.24900701867367	0	-4	\N	\N	2026-08-10 15:43:36.160007
04c8f595-018c-4059-9f43-701469dd21a0	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	443	397.64773569250156	3002.200641571048	1701.074093869294	0	-17	\N	\N	2026-08-10 15:43:36.160007
15b8e59f-6627-4cec-9f5a-4b0881051be4	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	879.3990532160477	819.7556403114403	38.32485913656467	38.32485913656498	0	47	\N	\N	2026-08-10 15:43:36.160007
3fea920a-2446-4b9e-9aaf-77c0654eaaf2	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4a7ae495-95b2-464b-8bc1-8d48ac136213	942.5548855641111	510.06470325690873	77.93197848838165	77.93197848838176	0	61	\N	\N	2026-08-10 15:43:36.160007
20b55fba-55fd-4a92-9174-f235b6c628f6	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	2392522b-487a-4d81-87ac-98b449349ec9	291.6862718215966	787.0052417033013	398.72652387522265	320.45837623330846	0	27	\N	\N	2026-08-10 15:43:36.160007
069f7a06-9bb8-43e5-a00b-7d2bbb3a641e	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	284.2189246093717	198.16644647904963	126.21800500290826	553.2662378348153	-89.55677313579712	-10	\N	\N	2026-08-10 15:43:36.160007
159025ae-7990-46a9-88ab-c4cde993f92c	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	-450.91728607203356	193.10618260257385	130.62172131247522	1336.2827050312505	-89.72435986409796	24	\N	\N	2026-08-10 15:43:36.160007
0bb16f03-040a-47eb-99c7-77345ad5ccbd	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	df00dd36-4eb2-4e73-b854-90f3ef4ea1bc	-253.6818030683689	-255.29064117077084	306.21416202061374	306.2141620206144	0	29	\N	\N	2026-08-10 15:43:36.160007
7d793d09-46b6-49fe-bbc8-f4a9590f9b0c	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	946.5131110908648	281.27229219790786	920.7319675500543	530.7138263345745	0	-16	\N	\N	2026-08-10 15:43:36.160007
0c78d644-3ec7-47c3-b3e6-00aa0b8bb7a6	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	1035.3099752303024	710.039984196673	37.45898357268325	37.458983572683394	0	48	\N	\N	2026-08-10 15:43:36.160007
0fcf6f4c-43d3-4376-809d-b5120e5593ee	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	763.3426337088274	581.4953976193237	24.523898081940562	24.523898081940406	0	56	\N	\N	2026-08-10 15:43:36.160007
2a93417c-6f5b-4104-87d7-644a5582bce9	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	761.4944514854019	551.2367252288007	24.523898081940562	24.523898081940406	0	58	\N	\N	2026-08-10 15:43:36.160007
04aece8b-e4f7-439e-a957-c7b67c96c824	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	aa043cb2-f4ab-4651-9614-6a16a386e343	1688.211873536059	267.0340239049103	190.11073667586902	190.11073667587002	-0.12392515972146068	19	\N	\N	2026-08-10 15:43:36.160007
0704082e-7d90-4e8d-8b94-52c4c926e9d4	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1386.8224232402586	290.27524885669663	79.94887095679036	474.5220068910305	0	35	\N	\N	2026-08-10 15:43:36.160007
0240b457-e9f6-42ef-99f3-fe4abf5cfb3f	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	0089fa9f-3925-4474-872b-9cc4b72597f5	766.1932115184865	417.17105541730166	12.508457707247022	19.489238921455044	-89.75145200098588	4	\N	\N	2026-08-10 15:43:36.160007
17a58e49-495e-4400-b2e3-f59cee785dce	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	0089fa9f-3925-4474-872b-9cc4b72597f5	1066.7738146140418	403.7205982119785	12.508457707246961	-21.349891288891293	2.203677012897402	5	\N	\N	2026-08-10 15:43:36.160007
15e6673e-fb01-4188-bda3-48676408f53a	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	1689.1393323881393	384.28880896517506	73.83369167823321	219.13017218796216	0	18	\N	\N	2026-08-10 15:43:36.160007
018cbe04-23d8-443e-8fea-e33bbdac3d6d	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	0089fa9f-3925-4474-872b-9cc4b72597f5	767.5436632023711	443.871958785071	12.508457707247022	19.489238921455044	-89.75145200098588	3	\N	\N	2026-08-10 15:43:36.160007
14372a3f-c1bf-4b09-a109-4e23c7b032ed	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	727.0072539183059	761.8957380715376	450.8775239706274	564.9872239850436	0	-7	\N	\N	2026-08-10 15:43:36.160007
2a96de7a-4b9c-4332-b0ec-32ab2c923ff1	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	837.7986196068468	670.7142083074676	24.523898081940562	24.523898081940406	0	56	\N	\N	2026-08-10 15:43:36.160007
4a8b1913-9156-49d9-a365-32d914fffcdc	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	877.5306517413799	771.8238974547409	36.088552164458996	36.08855216445883	0	46	\N	\N	2026-08-10 15:43:36.160007
084c65b0-c53d-4885-8a93-691b7bc889bb	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	660e113e-63c0-4c4b-8225-776bf832a7f4	-171.56814541685304	8.286506094527706	150.59898767887313	117.81612413280234	0	28	\N	\N	2026-08-10 15:43:36.160007
939531a8-63d1-42a2-ab5d-774f9848cb3a	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9a84779-4496-4194-8f9c-88edd01dd7d7	950.8570659752593	244.43959156762503	438.84549269988077	438.8454926998807	0	62	\N	\N	2026-08-10 15:43:36.160007
99d2ede7-9e33-47e9-a70a-6ebf873bdacc	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	e812bd26-d8af-4cc0-9964-164f2828bb2c	493.0777476837925	554.5678245695065	50.97400739036167	85.61765003089668	0	63	\N	\N	2026-08-10 15:43:36.160007
77418508-4ee2-43ff-a059-c043ee214ace	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4204e5d8-9b07-4c50-8c37-186bfaf5dad8	840.3297817675164	598.2217856052737	242.59422152046736	209.18074185050017	1.2432448558303928	8	\N	\N	2026-08-10 15:43:36.160007
085992eb-348b-454e-8d3e-3e578090452d	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	851.7701806411765	586.7662434359598	163.9537162866614	113.33735391292952	0	-6	\N	\N	2026-08-10 15:43:36.160007
0ef6873f-6d98-4dda-907d-b0800102324b	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	c69788ec-e49c-43c2-9594-2aa4cfd3dfc7	1249.5187371796906	411.043624788844	131.1286666951249	107.75016501244193	0	14	\N	\N	2026-08-10 15:43:36.160007
084c73b2-1310-4f98-a289-722f6b6ec37b	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	4015b44b-f830-40cd-9204-65c9fa09f166	1039.0723492575419	823.5859465110666	36.9176069858758	36.917606985875565	0	50	\N	\N	2026-08-10 15:43:36.160007
3601009a-63e3-410e-9efa-e75cd4c5bd32	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1136.0160246803011	584.8025997675852	23.97049836359445	-23.970498363594043	-180	55	\N	\N	2026-08-10 15:43:36.160007
053ec082-d60b-4a22-b398-2440d7fe30df	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	1040.7043986029735	670.62304744459	24.523898081940562	24.523898081940406	0	58	\N	\N	2026-08-10 15:43:36.160007
1360c871-6f82-4ca5-b881-86731332035a	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	f79c90a7-3a35-4953-bc6b-b0743ec8dd95	1596.836789645377	643.6307796958622	238.04216906444688	99.99999999999987	0	17	\N	\N	2026-08-10 15:43:36.160007
017752f0-499d-472b-b978-793b533e1827	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	1699.9595666327384	783.8694521476596	464.52208205301577	464.52208205301395	0	-8	\N	\N	2026-08-10 15:43:36.160007
2ab485d8-0531-4e79-8511-fbcbb0e01f95	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	788.3752496572993	634.1280773058545	24.523898081940562	24.523898081940406	0	56	\N	\N	2026-08-10 15:43:36.160007
1a2dabcd-cb29-4635-b6a4-5a64d6f250d8	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	b9ea224c-9329-4bf8-94da-7ae8805eb846	940.3763342331966	779.8470636545386	152.16066071622822	741.5093601576627	0	10	\N	\N	2026-08-10 15:43:36.160007
01262cf8-514a-45e5-a5cd-0325b691c0d3	487b6fa1-4245-4a5a-b32b-a768a9c0fafe	6ec06eb7-4117-438c-b05a-b98f3c323cfd	1233.9205810025715	780.4185862547396	464.52208205301577	464.52208205301395	0	-5	\N	\N	2026-08-10 15:43:36.160007
0fc2627c-e360-4255-9668-9149bfcd3f30	46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	a7d71805-b792-4972-959d-f926a2804636	667	222	100	100	0	1	\N	\N	2026-08-10 14:09:09.111809
fb088567-5106-4124-b8eb-fda57f74fa6b	46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	bf53c31b-3b37-4e07-b526-103cfdc9970c	835	218	100	100	0	2	\N	\N	2026-08-10 14:09:09.111809
9fcc83cf-4cf2-475b-9d41-d47f4033d4e7	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	885	640	100	100	0	20	\N	\N	2026-08-04 04:17:10.542081
f5caf0d5-c116-4093-b3c9-9213babdc404	de5dc941-a1b2-4769-a6bc-8455560dfd4a	476737b4-e6c3-4f4f-8619-b93a5a3d9934	650.7468181081857	562.7468181081861	158.13887897142806	171.88158763645086	-175.94050966047078	21	\N	\N	2026-08-04 04:17:10.542081
aeb50960-f0f3-4995-befe-212440154996	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d310081a-022f-4fb1-93c7-1a512f391103	861.0329746296395	272.92691441830584	137.17005901566793	35.67057901644184	0	22	\N	\N	2026-08-04 04:17:10.542081
644980b2-d700-4f84-ab2a-54bc41bc5ae6	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d310081a-022f-4fb1-93c7-1a512f391103	858.5406831555043	265.98117317099513	137.7556238979296	23.128132508732932	0	23	\N	\N	2026-08-04 04:17:10.542081
d8c940f5-7a2c-4337-b6ae-0ac5a2142077	de5dc941-a1b2-4769-a6bc-8455560dfd4a	26c55fe6-73fd-400d-81aa-131f711058ef	581.4550579423611	314.1014485601952	57.070055322647995	57.07005532264805	0	26	\N	\N	2026-08-04 04:17:10.542081
25851e42-9001-4364-aa77-192cfd995ca5	de5dc941-a1b2-4769-a6bc-8455560dfd4a	adad4019-7c1b-4940-9173-6ac22f24aa15	544.6303272042213	430.6445194225702	39.733132667625846	39.73313266762586	0	27	\N	\N	2026-08-04 04:17:10.542081
6aa7e92a-1d92-4d8d-a13e-e2c4460b9f9b	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	562.4414411428629	647.4331120106311	77.68290864757515	77.68290864757509	0	28	\N	\N	2026-08-04 04:17:10.542081
0bdb366a-1c85-4f59-aaeb-5b5a0eb55660	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	545.7047226848558	606.8441146608717	61.08778959930162	61.087789599301566	0	45	\N	\N	2026-08-04 04:17:10.542081
583b087f-ac95-417b-b60e-cf945a8436e5	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	599.7042108003428	663.6867829959051	48.62849999301179	48.628499993011786	0	44	\N	\N	2026-08-04 04:17:10.542081
13189051-f3a3-4451-bd4f-65c865e6e4b3	de5dc941-a1b2-4769-a6bc-8455560dfd4a	35b7f7b7-d237-4eeb-8c9b-5aa190111b43	566.0573352184392	289.57914940728244	50.88600329218185	50.88600329218178	0	31	\N	\N	2026-08-04 04:17:10.542081
21f42208-8c67-480c-99af-57acdd801d73	de5dc941-a1b2-4769-a6bc-8455560dfd4a	35b7f7b7-d237-4eeb-8c9b-5aa190111b43	570.8385471827278	287.39862557460197	73.51610076419732	73.51610076419745	0	34	\N	\N	2026-08-04 04:17:10.542081
198e0247-58a3-4570-ade3-15562c443e18	de5dc941-a1b2-4769-a6bc-8455560dfd4a	35b7f7b7-d237-4eeb-8c9b-5aa190111b43	544.1777555248625	309.1800837002988	56.70343883908819	56.70343883908825	0	35	\N	\N	2026-08-04 04:17:10.542081
709245b9-8c8b-4158-8a0e-1eca54a6522d	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d79226f2-d436-4ad3-88ba-259230b07653	712.84090332739	526.8701327381757	21.108671341813498	21.108671341813526	0	36	\N	\N	2026-08-04 04:17:10.542081
ad022f16-d750-43f7-bda9-8dc2a2c461ac	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d79226f2-d436-4ad3-88ba-259230b07653	720.4763019934566	550.1477114615769	21.108671341813498	21.108671341813526	0	37	\N	\N	2026-08-04 04:17:10.542081
0858d6df-9cb0-4704-b3af-80a18b50e2ae	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d79226f2-d436-4ad3-88ba-259230b07653	728.9193231763193	573.3500574928867	21.108671341813498	21.108671341813526	0	38	\N	\N	2026-08-04 04:17:10.542081
c7896dd0-1bc2-4edc-a0fb-75c0f473565e	de5dc941-a1b2-4769-a6bc-8455560dfd4a	d79226f2-d436-4ad3-88ba-259230b07653	730.6248862454128	599.3768244866055	21.108671341813498	21.108671341813526	0	39	\N	\N	2026-08-04 04:17:10.542081
8b505ec0-85d5-4885-8fa9-f7dc1a32cf5c	de5dc941-a1b2-4769-a6bc-8455560dfd4a	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	600.0180750723307	607.6035523832597	22.460918128200415	22.460918128200376	0	43	\N	\N	2026-08-04 04:17:10.542081
ebe13f10-1def-4550-98ce-65950d6cae67	de5dc941-a1b2-4769-a6bc-8455560dfd4a	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	580.1194251960592	590.7450529975672	21.823293301369485	21.823293301369368	0	42	\N	\N	2026-08-04 04:17:10.542081
28f05b01-ac8c-49d8-a3be-acdf5838d1d3	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4015b44b-f830-40cd-9204-65c9fa09f166	627.9518301617602	654.6547536059529	100	100	0	46	\N	\N	2026-08-04 04:17:10.542081
aaef5e7e-537e-402f-8b89-b16ceeb4d399	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4583035c-805b-4559-832f-11dd5e99320e	908.9898369848734	305.7410281021138	48.76903428732267	48.769034287322654	0	47	\N	\N	2026-08-04 04:17:10.542081
9450521f-4be9-4647-b2eb-53b8b85a5736	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4583035c-805b-4559-832f-11dd5e99320e	874.6041601192144	304.58672995999837	47.905280556290904	47.90528055629083	0	48	\N	\N	2026-08-04 04:17:10.542081
e955d02b-deb1-46a2-86ea-f2a5ffc4c1c8	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4583035c-805b-4559-832f-11dd5e99320e	839.4058092024144	309.12154925613055	47.905280556290904	47.90528055629083	0	49	\N	\N	2026-08-04 04:17:10.542081
dd4ea255-2157-47ff-accc-85dfd3ca6a9e	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4015b44b-f830-40cd-9204-65c9fa09f166	900.6515198410683	346.52735776702536	100	100	0	50	\N	\N	2026-08-04 04:17:10.542081
db141b02-d198-4b63-9924-c1ff1d2a6771	de5dc941-a1b2-4769-a6bc-8455560dfd4a	df5020ab-908a-44ae-8bcc-2b5f83ec1dee	565.10480822463	372.91370572656683	74.75119804641082	74.75119804641062	0	51	\N	\N	2026-08-04 04:17:10.542081
dd76438e-4d31-45a3-bf69-52ae3e860be2	de5dc941-a1b2-4769-a6bc-8455560dfd4a	044658e0-08c7-497d-af5f-82d8f0d8f07c	568.5576726510892	489.06428930243254	67.20850136735875	67.20850136735869	0	52	\N	\N	2026-08-04 04:17:10.542081
8b434058-ab25-4147-a436-3d99e51a8c66	de5dc941-a1b2-4769-a6bc-8455560dfd4a	2fd5a158-819e-4fc5-a7fe-f262231c7573	702.7080900530074	492.4564556399753	67.01828039583938	67.01828039583954	0	53	\N	\N	2026-08-04 04:17:10.542081
aadb2b1f-f2b0-4066-9ddb-13eceec1d429	de5dc941-a1b2-4769-a6bc-8455560dfd4a	2e8d243e-849d-4ac6-89d2-9fbcea024082	905.6690073387925	646.2927261170437	52.241272867543195	52.241272867543316	0	54	\N	\N	2026-08-04 04:17:10.542081
224d6106-f433-44c3-9ffd-8f0e9b07f0b8	de5dc941-a1b2-4769-a6bc-8455560dfd4a	2e8d243e-849d-4ac6-89d2-9fbcea024082	855.1389794153462	655.0012428746968	100	100	0	55	\N	\N	2026-08-04 04:17:10.542081
738ba36f-3e9e-449b-ae8e-779d6cd48a09	de5dc941-a1b2-4769-a6bc-8455560dfd4a	2e8d243e-849d-4ac6-89d2-9fbcea024082	906.2492338044423	598.4318140172927	73.23149973256096	73.23149973256086	0	56	\N	\N	2026-08-04 04:17:10.542081
5ec081e9-e881-4b67-a820-ed187fb3c4af	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	904.9860475006608	652.8339790449006	93.89347019951292	93.89347019951305	0	57	\N	\N	2026-08-04 04:17:10.542081
d79aee46-ac73-4f31-8f54-2e0edfdbe5a5	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4583035c-805b-4559-832f-11dd5e99320e	855.1657601080159	589.6171711256318	74.70536288528756	74.70536288528746	0	62	\N	\N	2026-08-04 04:17:10.542081
046e7d0d-55f4-44b8-81eb-62800ac6af05	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	906.5909879260993	558.3568896827036	74.03481596320795	74.03481596320815	0	63	\N	\N	2026-08-04 04:17:10.542081
65a9e90c-c068-4666-bab7-93ff3c5413f1	de5dc941-a1b2-4769-a6bc-8455560dfd4a	e0cebf35-352e-424c-84e8-bfc905fbf755	853.4832100974728	637.4522054716506	52.74204927383489	52.742049273834915	0	64	\N	\N	2026-08-04 04:17:10.542081
b6ff98c9-7305-4e6c-9b4d-be6a129eb9ab	de5dc941-a1b2-4769-a6bc-8455560dfd4a	5a8b21ad-f7f1-4734-8be7-2422364eeb47	547.3905912337336	539.4169142683536	34.53887977985501	34.53887977985479	0	67	\N	\N	2026-08-04 04:17:10.542081
b632d6a8-609a-43a5-be0e-9badea7a6c80	de5dc941-a1b2-4769-a6bc-8455560dfd4a	af7da8f9-b13a-4d56-a61d-bafdf70a6326	551.3321902196097	559.9742026160034	31.312693951202306	31.312693951202295	0	66	\N	\N	2026-08-04 04:17:10.542081
1fd6ed60-9b13-4487-9968-a9a4c62d4e59	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	707.9337910941804	653.2659473617696	46.878329741650944	46.87832974165089	0	68	\N	\N	2026-08-04 04:17:10.542081
f4d0a74d-2993-4577-b5bc-1828d486640b	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	759.3857996049336	596.8139694474187	46.878329741650944	46.87832974165089	0	69	\N	\N	2026-08-04 04:17:10.542081
4df987d3-9061-4657-a81a-41f0abc8ee0d	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	739.318101732409	633.0951311495976	46.878329741650944	46.87832974165089	0	70	\N	\N	2026-08-04 04:17:10.542081
8bf6b7e3-d539-46c9-b3ad-63e6ef1b3a0f	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	769.6597953495573	559.4081609365239	46.878329741650944	46.87832974165089	0	71	\N	\N	2026-08-04 04:17:10.542081
1a82a89b-7b59-4c0b-a87e-36dbc75a227b	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	771.2647357749954	525.614458808623	46.878329741650944	46.87832974165089	0	72	\N	\N	2026-08-04 04:17:10.542081
2f118db3-d370-411f-bf53-b839cbe0f8da	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	770.7024123706376	492.5431779573207	46.878329741650944	46.87832974165089	0	73	\N	\N	2026-08-04 04:17:10.542081
c8cc8e51-d48f-4428-8507-94e7e442b6e3	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	737.6311315193354	364.8347098715807	46.878329741650944	46.87832974165089	0	74	\N	\N	2026-08-04 04:17:10.542081
c0d5d5cb-1a4c-49fa-bd2a-db16cff42a88	a73f39f4-168e-49f4-a1fa-69af642dce62	6ec06eb7-4117-438c-b05a-b98f3c323cfd	869.3716896553692	412.37168965536887	744.7591218570368	647.7433793107366	0	1	\N	\N	2026-08-04 04:20:30.448543
89b729f8-46c7-4e49-834a-603552a4c0ab	a73f39f4-168e-49f4-a1fa-69af642dce62	1ff34f29-0440-490a-a836-92dc44d8f7c6	579.7504901941936	164.7504901941934	177.50098038838664	151.50098038838735	0	69	\N	\N	2026-08-04 04:20:30.448543
2559537e-4a0f-47ed-8988-f96ebd9da806	a73f39f4-168e-49f4-a1fa-69af642dce62	1ff34f29-0440-490a-a836-92dc44d8f7c6	1164.4465943706166	678.6435906352425	162.94169349593005	139.25086597242057	-178.43598822888987	92	\N	\N	2026-08-04 04:20:30.448543
3e7ef1e7-73a5-4750-b40e-7a089837d800	a73f39f4-168e-49f4-a1fa-69af642dce62	1ff34f29-0440-490a-a836-92dc44d8f7c6	1153.0302998191735	170.14697628219776	164.37958343758044	180.4547031099568	89.66541011838298	104	\N	\N	2026-08-04 04:20:30.448543
24887e07-f811-4918-90e9-ae690b0cd982	a73f39f4-168e-49f4-a1fa-69af642dce62	1ff34f29-0440-490a-a836-92dc44d8f7c6	569.4636894200615	663.9805989502269	163.5062327344832	149.53279820895827	-90.10138896381429	5	\N	\N	2026-08-04 04:20:30.448543
fa9c51c2-7cad-4d0d-a08c-cb1f943fb402	a73f39f4-168e-49f4-a1fa-69af642dce62	6e823dbe-f90d-45c7-bba2-7bbce0ebae95	518	122	100	100	0	70	\N	\N	2026-08-04 04:20:30.448543
4b6678b2-1768-43f2-9c07-14e4fae83c47	a73f39f4-168e-49f4-a1fa-69af642dce62	4015b44b-f830-40cd-9204-65c9fa09f166	512	174	111.52802338426038	111.5280233842604	0	77	\N	\N	2026-08-04 04:20:30.448543
a0babdea-0cc4-450e-9827-65f8e40072bb	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	578	108	100	100	0	76	\N	\N	2026-08-04 04:20:30.448543
9be5ab73-d921-4fcb-8f72-ef9135c2b42b	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	518	240	100	100	0	9	\N	\N	2026-08-04 04:20:30.448543
6300710a-fbea-4fae-bb02-f4afc443e342	a73f39f4-168e-49f4-a1fa-69af642dce62	2e8d243e-849d-4ac6-89d2-9fbcea024082	516	327	100	100	0	10	\N	\N	2026-08-04 04:20:30.448543
fd41c7c5-be5c-4a16-be82-305befc85c94	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	561	308	100	100	0	11	\N	\N	2026-08-04 04:20:30.448543
8c6e4f85-9e5b-4cf5-8b11-e803a590275e	a73f39f4-168e-49f4-a1fa-69af642dce62	6e823dbe-f90d-45c7-bba2-7bbce0ebae95	567	394	100	100	0	35	\N	\N	2026-08-04 04:20:30.448543
eb4d3d7e-d838-41b2-8322-6f6a2cef6c7b	a73f39f4-168e-49f4-a1fa-69af642dce62	4015b44b-f830-40cd-9204-65c9fa09f166	517	384	100	100	0	13	\N	\N	2026-08-04 04:20:30.448543
300549b8-0413-4d10-b5bf-ebbe23f62d61	a73f39f4-168e-49f4-a1fa-69af642dce62	6e823dbe-f90d-45c7-bba2-7bbce0ebae95	503	446	100	100	0	14	\N	\N	2026-08-04 04:20:30.448543
9a7640de-4bfd-402b-b04b-033faa5c5b8e	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	580.9038495842366	311.90384958423596	107.8076991684733	107.80769916847332	0	1	\N	\N	2026-08-04 04:17:10.542081
a0acad19-c906-44b0-8910-867e6793fbb7	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	683	311	107.8076991684733	107.80769916847332	0	2	\N	\N	2026-08-04 04:17:10.542081
07a2926d-0a20-4f9f-80f3-05426016f5d1	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	686	420	107.8076991684733	107.80769916847332	0	3	\N	\N	2026-08-04 04:17:10.542081
7dac11ca-c5bf-49ff-a965-0c062606c484	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	798.3999301335202	433.05157984287865	134.39687420704198	143.78262906673848	0	4	\N	\N	2026-08-04 04:17:10.542081
1a66c50d-abbd-4e6f-b3c2-5318136538a5	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	579	419	107.8076991684733	107.80769916847332	0	5	\N	\N	2026-08-04 04:17:10.542081
2e261b61-ae36-4b8b-b976-a88fa6c3601a	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	783	309	107.8076991684733	107.80769916847332	0	6	\N	\N	2026-08-04 04:17:10.542081
8b343eeb-2bb0-4e63-b10b-927e1cf73022	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	579	633	107.8076991684733	107.80769916847332	0	7	\N	\N	2026-08-04 04:17:10.542081
5b5f3c0b-97d5-4080-8917-a3aea4140423	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	579	526	107.8076991684733	107.80769916847332	0	8	\N	\N	2026-08-04 04:17:10.542081
e47f61e3-93e5-4fd5-a194-0ade926771e0	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	665	524	100	100	0	9	\N	\N	2026-08-04 04:17:10.542081
9b0cb602-791b-426d-821b-48d9846fc1a9	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	669.5731272553206	626.5731272553217	100	100	0	10	\N	\N	2026-08-04 04:17:10.542081
7170f0db-c844-4498-8d57-a1a9477ae7b4	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	744	521	100	100	0	11	\N	\N	2026-08-04 04:17:10.542081
6da2a9b2-4253-4f16-858a-75d726a3064f	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	634	383	100	100	0	12	\N	\N	2026-08-04 04:17:10.542081
d81b59f1-0736-472d-bccb-daf69cedeafe	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	785.1747892152324	522.5243676456977	100	100	0	13	\N	\N	2026-08-04 04:17:10.542081
feeb4358-ec9f-435f-bd51-4917f4446dec	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	781	621	106.0000000000009	117.00000000000077	0	14	\N	\N	2026-08-04 04:17:10.542081
f1c4af15-d6c0-4fee-a695-2479fb4490e9	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	881	304	100	100	0	15	\N	\N	2026-08-04 04:17:10.542081
ec8d609e-a948-4875-b318-d4c7ddbcf5fb	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	883	374	100	100	0	17	\N	\N	2026-08-04 04:17:10.542081
868c8749-76e5-49a8-b823-2161b2b26faa	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	879.8327361702038	463.0569489361913	100	100	0	18	\N	\N	2026-08-04 04:17:10.542081
ac5d5cca-4352-4c9d-ad8b-6246b8202c17	de5dc941-a1b2-4769-a6bc-8455560dfd4a	1fd699fc-6c9e-4eb0-8dd5-b7e667d4fcc7	883	547	100	100	0	19	\N	\N	2026-08-04 04:17:10.542081
1f3b4748-7b32-4620-8b4a-82650b86b591	a73f39f4-168e-49f4-a1fa-69af642dce62	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	563	469	100	100	0	62	\N	\N	2026-08-04 04:20:30.448543
6a44715a-83ba-4e38-8e74-779cd80a1090	a73f39f4-168e-49f4-a1fa-69af642dce62	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	509	692	100	100	0	18	\N	\N	2026-08-04 04:20:30.448543
d43b4b02-b151-4754-b144-4b0a590cb5ce	a73f39f4-168e-49f4-a1fa-69af642dce62	da1681ad-0a24-4148-9f7c-009e9307549b	511	640	100	100	0	17	\N	\N	2026-08-04 04:20:30.448543
8ee4d0fe-16b6-4994-ae0a-432c347dc661	a73f39f4-168e-49f4-a1fa-69af642dce62	0f48ad40-c1f0-4e29-890c-0f3634ac9eb6	527	536	100	100	0	19	\N	\N	2026-08-04 04:20:30.448543
f4175d0d-5df6-4930-9120-a10ed66f2a3d	a73f39f4-168e-49f4-a1fa-69af642dce62	4015b44b-f830-40cd-9204-65c9fa09f166	507	567	100	100	0	22	\N	\N	2026-08-04 04:20:30.448543
92608f0f-5f61-4b91-8a2b-db9ef4540a6c	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	566	551	100	100	0	61	\N	\N	2026-08-04 04:20:30.448543
16031613-6cfb-4cba-a6b0-f71e2b84016f	a73f39f4-168e-49f4-a1fa-69af642dce62	334f3b9e-e388-4baf-a553-0323f165f921	1140.02969066334	420.6294864014631	421.02889368477116	250.09245327150015	89.20714565624323	55	\N	\N	2026-08-04 04:20:30.448543
8b709cd6-88d2-4cec-b76d-042555262d6f	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	1026	396	100	100	0	26	\N	\N	2026-08-04 04:20:30.448543
09ca19a0-d090-40ce-b6c0-38107cf9a5fa	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	945	396	100	100	0	30	\N	\N	2026-08-04 04:20:30.448543
f2aa589e-9a2d-4adb-8174-83fc20ec9c63	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	863	400	100	100	0	31	\N	\N	2026-08-04 04:20:30.448543
ce72dc88-6de5-4191-8828-d374711c66f3	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	777	403	100	100	0	32	\N	\N	2026-08-04 04:20:30.448543
a466b377-2026-4fb5-a6ce-fae3650405ee	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	698	403	100	100	0	33	\N	\N	2026-08-04 04:20:30.448543
b6591268-ef2f-4df9-ad2b-d47e0ff45f83	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	629	402	100	100	0	34	\N	\N	2026-08-04 04:20:30.448543
4743b254-58f4-45b9-8578-6acbbc0b2803	a73f39f4-168e-49f4-a1fa-69af642dce62	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	984.2638841291588	465.2638841291599	40.52776825831897	40.52776825831901	0	37	\N	\N	2026-08-04 04:20:30.448543
c2af5489-e47a-4e8a-84e5-b3627eabc7a8	a73f39f4-168e-49f4-a1fa-69af642dce62	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	904.2638841291588	468.2638841291599	40.52776825831897	40.52776825831901	0	121	\N	\N	2026-08-04 04:20:30.448543
7296a9f1-cba8-4805-8fc1-6a2670e8c04c	a73f39f4-168e-49f4-a1fa-69af642dce62	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	893.2638841291587	324.2638841291599	40.52776825831897	40.52776825831901	0	45	\N	\N	2026-08-04 04:20:30.448543
275ab439-04a7-487a-9c0e-56dd692c733a	a73f39f4-168e-49f4-a1fa-69af642dce62	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	891.2638841291587	265.2638841291599	40.52776825831897	40.52776825831901	0	46	\N	\N	2026-08-04 04:20:30.448543
5df29947-a9f3-4ed7-8657-00bee4569bb0	a73f39f4-168e-49f4-a1fa-69af642dce62	af82008f-22d0-4c22-97ab-917cabd82136	963.6737627868406	152.57672103953522	59.004978048671624	98.93194471300149	89.71081750804888	59	\N	\N	2026-08-04 04:20:30.448543
f06da2c8-558a-471b-822a-1b93e7d516a3	a73f39f4-168e-49f4-a1fa-69af642dce62	80a86758-e15b-4b3a-a664-b6a5388a08aa	966.4999999999995	214.99999999999878	67.00000000000036	100.00000000000065	91.06323061170453	58	\N	\N	2026-08-04 04:20:30.448543
47afbc03-9b57-42d9-a5f4-a4a0e89f9fae	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	970	307	100	100	0	52	\N	\N	2026-08-04 04:20:30.448543
acb90378-276b-433c-9d4b-08da0ebc4e74	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	966	214	100	100	0	53	\N	\N	2026-08-04 04:20:30.448543
0eb9e819-82fd-4451-a5c6-b0d4f8052edf	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	965	141	100	100	0	54	\N	\N	2026-08-04 04:20:30.448543
ad2d5fda-4357-4875-8521-bda04540c362	a73f39f4-168e-49f4-a1fa-69af642dce62	9aa34528-cbb5-456b-ad82-40ca6c4a3caa	643.4999999999983	543.9999999999998	113.00000000000067	144.000000000001	0	60	\N	\N	2026-08-04 04:20:30.448543
65df1eb4-7ab3-44ba-a3b0-f2cddbc533e6	a73f39f4-168e-49f4-a1fa-69af642dce62	044658e0-08c7-497d-af5f-82d8f0d8f07c	680.5532954612507	596.5532954612506	75.10659092250175	75.10659092250172	0	63	\N	\N	2026-08-04 04:20:30.448543
2f0289c2-0745-49fa-b385-8823ecd61bc5	a73f39f4-168e-49f4-a1fa-69af642dce62	468a7c05-00d8-4818-a5c2-645c821ef405	883.4630836683577	590.6079044208454	56.07383266328315	107.85802382159109	-90.32303100933795	118	\N	\N	2026-08-04 04:20:30.448543
cc15b3f5-aec7-4d19-98db-fabae626c06f	a73f39f4-168e-49f4-a1fa-69af642dce62	128c8098-b5f1-4ea5-95d1-a75f8d97a310	884.9999999999994	637.9999999999969	30.00000000000026	74.00000000000034	-89.65506741157954	119	\N	\N	2026-08-04 04:20:30.448543
1c827cd2-2068-4a60-9cd7-7d0cc46a149f	a73f39f4-168e-49f4-a1fa-69af642dce62	128c8098-b5f1-4ea5-95d1-a75f8d97a310	885.9999999999984	544.9999999999965	30.000000000000274	74.00000000000018	90.79572355274003	120	\N	\N	2026-08-04 04:20:30.448543
3286bef1-5255-4f79-a21f-e1f117e8d945	a73f39f4-168e-49f4-a1fa-69af642dce62	e0cebf35-352e-424c-84e8-bfc905fbf755	592	216	100	100	0	74	\N	\N	2026-08-04 04:20:30.448543
80bb2a35-7727-4389-ac6f-4e325b2d1e13	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	542	264	100	100	0	75	\N	\N	2026-08-04 04:20:30.448543
ad4e8228-23bd-4e77-acb2-2b5397c2cc14	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	684.9999999999978	726.0588235294118	99.9999999999998	34.1176470588237	0	85	\N	\N	2026-08-04 04:20:30.448543
05dd0b0d-f712-4530-b8d5-3db9f60a73a8	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	906.9999999999978	728.0588235294118	99.9999999999998	34.1176470588237	0	88	\N	\N	2026-08-04 04:20:30.448543
4b600bc7-058c-407a-b345-6e42878ab616	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	981.9999999999978	727.0588235294118	99.9999999999998	34.1176470588237	0	90	\N	\N	2026-08-04 04:20:30.448543
cd08daa6-19b5-4db8-b455-9858fecc8c4e	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	1070.9999999999977	724.0588235294118	99.9999999999998	34.1176470588237	0	91	\N	\N	2026-08-04 04:20:30.448543
b525da82-1a74-4924-a731-e0f36323665c	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	768.9999999999978	726.0588235294118	99.9999999999998	34.1176470588237	0	86	\N	\N	2026-08-04 04:20:30.448543
da052915-e3cf-4397-bdfd-aa662467be06	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	828.9999999999978	727.0588235294118	99.9999999999998	34.1176470588237	0	87	\N	\N	2026-08-04 04:20:30.448543
f8078f6a-3210-4253-9ca8-cac2c1631787	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	679.999999999998	105.60499999999992	87.99999999999957	29.210000000000004	0	93	\N	\N	2026-08-04 04:20:30.448543
8121204c-38d1-4630-bb76-d5539d096bbb	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	825.999999999998	104.6049999999999	87.99999999999957	29.210000000000004	0	100	\N	\N	2026-08-04 04:20:30.448543
8379ee2a-5753-4799-b919-4a52faf31ffc	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	752.999999999998	104.6049999999999	87.99999999999957	29.210000000000004	0	95	\N	\N	2026-08-04 04:20:30.448543
3c389134-c74b-4c24-af89-7eeba665df02	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	903.999999999998	106.6049999999999	87.99999999999957	29.210000000000004	0	101	\N	\N	2026-08-04 04:20:30.448543
2d0614a9-515f-4d7e-bf28-a111f842d7b6	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	977.9999999999964	108.6049999999999	87.99999999999936	27.209999999999976	0	102	\N	\N	2026-08-04 04:20:30.448543
15d4fcfa-98fe-4266-a1fe-2de44e21a1ab	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	755.1293400299465	418.45398221213	46.878329741650944	46.87832974165089	0	75	\N	\N	2026-08-04 04:17:10.542081
3a326a68-69d2-415f-8a40-f505fcf3b8a4	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	763.9584932213728	451.84545880791376	46.878329741650944	46.87832974165089	0	76	\N	\N	2026-08-04 04:17:10.542081
ccbeeb2d-0071-47cd-b2e2-0e63a1b839af	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	725.6701655616382	331.92352689251936	46.878329741650944	46.87832974165089	0	77	\N	\N	2026-08-04 04:17:10.542081
7453bf0a-a397-4c20-afcc-9740bda938fe	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	743.1683740722493	389.1549056160625	46.878329741650944	46.87832974165089	0	78	\N	\N	2026-08-04 04:17:10.542081
7622fc96-ab3b-4e5c-b224-c88737549be6	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	708.8094940651602	278.2666582211907	46.878329741650944	46.87832974165089	0	79	\N	\N	2026-08-04 04:17:10.542081
5c1cdce1-a6f5-4c6d-87fd-303cd3430924	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	717.3213059869347	299.01234391345804	46.878329741650944	46.87832974165089	0	80	\N	\N	2026-08-04 04:17:10.542081
0d7a7a9e-6b0d-4e47-abe0-262950cb402e	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	759.9441613062619	642.16245029787	46.878329741650944	46.87832974165089	0	81	\N	\N	2026-08-04 04:17:10.542081
e615b79e-d291-428c-a74e-84a9763f6226	de5dc941-a1b2-4769-a6bc-8455560dfd4a	3366eb93-6958-42bf-8786-27256c616384	739.0190154881561	655.9944273677245	46.878329741650944	46.87832974165089	0	82	\N	\N	2026-08-04 04:17:10.542081
f7f88f71-fed5-47da-a6b0-8c26c9f756f3	de5dc941-a1b2-4769-a6bc-8455560dfd4a	adad4019-7c1b-4940-9173-6ac22f24aa15	911.7673430079055	411.1023554021711	41.32046335461316	41.32046335461307	0	84	\N	\N	2026-08-04 04:17:10.542081
73f2639b-e1c8-4401-87e3-130d80ab0008	de5dc941-a1b2-4769-a6bc-8455560dfd4a	adad4019-7c1b-4940-9173-6ac22f24aa15	917.8690123326767	437.1144792020549	28.006600316010005	28.006600316009834	0	85	\N	\N	2026-08-04 04:17:10.542081
9f3b20ec-891e-4d09-8a1b-d6bfe6abb304	de5dc941-a1b2-4769-a6bc-8455560dfd4a	adad4019-7c1b-4940-9173-6ac22f24aa15	915.5759756611989	463.17818691859975	33.578858302295906	33.578858302295835	0	86	\N	\N	2026-08-04 04:17:10.542081
371f5d55-ee7a-4bdd-8af9-25ec48e8653d	de5dc941-a1b2-4769-a6bc-8455560dfd4a	adad4019-7c1b-4940-9173-6ac22f24aa15	914.8909932979481	495.3195032719435	33.968222923811844	33.96822292381168	0	87	\N	\N	2026-08-04 04:17:10.542081
65bd8300-b06a-4cf2-a1e5-a9aaf3e746f7	de5dc941-a1b2-4769-a6bc-8455560dfd4a	4f25c30d-51fe-4cd1-84d7-3c8268169a2c	868.7136245710428	446.0116423990406	48.28838628425685	86.57671394399071	0	88	\N	\N	2026-08-04 04:17:10.542081
203b96c6-d974-4c25-870f-1d0777693bd1	a73f39f4-168e-49f4-a1fa-69af642dce62	6019ce3f-9a82-4894-a3ab-b4505410c0a4	1055.999999999998	109.6049999999999	87.99999999999957	29.210000000000004	0	103	\N	\N	2026-08-04 04:20:30.448543
07dab26a-a06d-4513-a166-7dddb79ef940	a73f39f4-168e-49f4-a1fa-69af642dce62	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	1199	127	100	100	0	112	\N	\N	2026-08-04 04:20:30.448543
1fd0c234-c0a5-435a-8df0-967bf13c6527	a73f39f4-168e-49f4-a1fa-69af642dce62	4015b44b-f830-40cd-9204-65c9fa09f166	1156	108	100	100	0	110	\N	\N	2026-08-04 04:20:30.448543
8bdc5a67-1de5-45e4-ac67-9f66e735161d	a73f39f4-168e-49f4-a1fa-69af642dce62	1b3f5af0-8b4e-4e03-948b-6b927a5aa407	1111	109	95.52486587271373	95.5248658727138	0	109	\N	\N	2026-08-04 04:20:30.448543
bc02c6c1-ba03-4c18-abc1-75b4932a5505	a73f39f4-168e-49f4-a1fa-69af642dce62	4015b44b-f830-40cd-9204-65c9fa09f166	1224	180	100	100	0	114	\N	\N	2026-08-04 04:20:30.448543
9d4bff1e-6082-4c1f-a013-cf4f221fe64b	a73f39f4-168e-49f4-a1fa-69af642dce62	a62af0f6-57d9-4c37-80a6-f553e3133cdd	1221.9999999999989	230.49999999999997	85.99999999999993	75	0	113	\N	\N	2026-08-04 04:20:30.448543
0de6177b-c69f-4a9e-85d1-cd9a3b9b79b7	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	974	488	100	100	0	115	\N	\N	2026-08-04 04:20:30.448543
913986b4-1206-42c8-9e9d-6f1387350cdd	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	973	578	100	100	0	116	\N	\N	2026-08-04 04:20:30.448543
bbf7af2e-1ec2-47d4-be01-181cca97263e	a73f39f4-168e-49f4-a1fa-69af642dce62	3366eb93-6958-42bf-8786-27256c616384	980	665	100	100	0	117	\N	\N	2026-08-04 04:20:30.448543
c2d71a7b-57d5-4050-91be-bb3fc8f09bfd	a73f39f4-168e-49f4-a1fa-69af642dce62	5b2a4caf-ab92-4aea-8e2f-dda5bde5bbba	908.2638841291588	681.2638841291599	40.52776825831897	40.52776825831901	0	122	\N	\N	2026-08-04 04:20:30.448543
\.


--
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_members (project_id, user_id, role, joined_at, updated_at) FROM stdin;
487b6fa1-4245-4a5a-b32b-a768a9c0fafe	d48f9027-4956-400e-b0d4-b1e672d221a2	admin	2026-08-03 08:41:48.695446	2026-08-03 08:41:48.695446
487b6fa1-4245-4a5a-b32b-a768a9c0fafe	03ec30d8-ec62-4645-bef9-8eef8a50a930	viewer	2026-08-03 13:00:02.278185	2026-08-03 13:00:02.278185
3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	0d276714-02e1-4341-a71f-6052e612f042	admin	2026-08-04 02:31:15.901472	2026-08-04 02:31:15.901472
de5dc941-a1b2-4769-a6bc-8455560dfd4a	03ec30d8-ec62-4645-bef9-8eef8a50a930	admin	2026-08-04 02:36:30.939541	2026-08-04 02:36:30.939541
a73f39f4-168e-49f4-a1fa-69af642dce62	d48f9027-4956-400e-b0d4-b1e672d221a2	admin	2026-08-04 03:32:42.238413	2026-08-04 03:32:42.238413
a73f39f4-168e-49f4-a1fa-69af642dce62	03ec30d8-ec62-4645-bef9-8eef8a50a930	viewer	2026-08-04 03:51:32.429833	2026-08-04 03:51:32.429833
de5dc941-a1b2-4769-a6bc-8455560dfd4a	d48f9027-4956-400e-b0d4-b1e672d221a2	viewer	2026-08-04 04:47:36.495921	2026-08-04 04:47:36.495921
a73f39f4-168e-49f4-a1fa-69af642dce62	0d276714-02e1-4341-a71f-6052e612f042	viewer	2026-08-04 04:52:20.38028	2026-08-04 04:52:20.38028
3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	03ec30d8-ec62-4645-bef9-8eef8a50a930	viewer	2026-08-04 08:04:41.7333	2026-08-04 08:04:41.7333
487b6fa1-4245-4a5a-b32b-a768a9c0fafe	0d276714-02e1-4341-a71f-6052e612f042	viewer	2026-08-04 08:04:48.796828	2026-08-04 08:04:48.796828
46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	0d276714-02e1-4341-a71f-6052e612f042	admin	2026-08-04 08:15:32.746819	2026-08-04 08:15:32.746819
46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	d48f9027-4956-400e-b0d4-b1e672d221a2	viewer	2026-08-04 08:16:08.191303	2026-08-04 08:16:08.191303
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, owner_id, name, description, thumbnail_url, created_at, updated_at) FROM stdin;
de5dc941-a1b2-4769-a6bc-8455560dfd4a	03ec30d8-ec62-4645-bef9-8eef8a50a930	Backyard	Landscape Layout	https://res.cloudinary.com/ddalcxun8/image/upload/v1785817148/landscape/thumbnails/project_de5dc941-a1b2-4769-a6bc-8455560dfd4a.png	2026-08-04 02:36:30.939541	2026-08-04 04:17:17.485802
a73f39f4-168e-49f4-a1fa-69af642dce62	d48f9027-4956-400e-b0d4-b1e672d221a2	Future Home	Design Layout	https://res.cloudinary.com/ddalcxun8/image/upload/v1785817349/landscape/thumbnails/project_a73f39f4-168e-49f4-a1fa-69af642dce62.png	2026-08-04 03:32:42.238413	2026-08-04 04:20:38.314485
3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5	0d276714-02e1-4341-a71f-6052e612f042	Map	မြန်မာနိုင်ငံမြေပုံ	https://res.cloudinary.com/ddalcxun8/image/upload/v1785831146/landscape/thumbnails/project_3fa6c565-acc0-4a43-9f6a-5d258c3ecfa5.png	2026-08-04 02:31:15.901472	2026-08-04 08:10:35.312807
46d6354b-6d3d-489c-9fe8-fadf61d7cf2b	0d276714-02e1-4341-a71f-6052e612f042	school		https://res.cloudinary.com/ddalcxun8/image/upload/v1786371063/landscape/thumbnails/project_46d6354b-6d3d-489c-9fe8-fadf61d7cf2b.png	2026-08-04 08:15:32.746819	2026-08-10 14:09:13.4946
487b6fa1-4245-4a5a-b32b-a768a9c0fafe	d48f9027-4956-400e-b0d4-b1e672d221a2	NSPU	NSPU 2d top view 	https://res.cloudinary.com/ddalcxun8/image/upload/v1786376731/landscape/thumbnails/project_487b6fa1-4245-4a5a-b32b-a768a9c0fafe.png	2026-08-03 08:41:48.695446	2026-08-10 15:43:40.656427
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, hash_password, role, created_at) FROM stdin;
d48f9027-4956-400e-b0d4-b1e672d221a2	yuyu	yu@gmail.com	$2b$10$995N78pKtqfoj0Z8kfiyzeMf3T.MXiEGm4JLd/mkAuOMBxXEXf3Ou	user	2026-07-25 04:35:57.181783
03ec30d8-ec62-4645-bef9-8eef8a50a930	paige	paige@gmail.com	$2b$10$YzWXcL/tAZY8a0ji7DMr7O6ZTHgFjJJU7Z2BztdYPvpcF/Wki0vO.	user	2026-07-25 04:36:09.356069
0d276714-02e1-4341-a71f-6052e612f042	flora	flora@gmail.com	$2b$10$spnlhZAgi4jSgaN75InWy.DsHamD0jiL5c6GqIT5UzxWBbK.jSPX6	user	2026-07-27 22:14:43.099699
4b72875b-2dc5-490d-80ad-acd53bd6c723	Khant	khant@gmail.com	$2b$10$MFAF2JBPtkoeGjQqFp/qtu.1W7jHrX4XjFoIqHaWQ1ePCaUP3sjFu	user	2026-07-31 02:55:25.61408
7c3e9b99-265a-4786-8ea8-a3ae703d5ce6	thartti	ti@gmail.com	$2b$10$3i3TYqlQzWUPBVyLHsSRE.W213EVS2/IfzCUjFprZy8U1k5J/AJhy	user	2026-08-04 07:34:59.080719
\.


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: asset_categories asset_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_name_key UNIQUE (name);


--
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (id);


--
-- Name: asset_subcategories asset_subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_subcategories
    ADD CONSTRAINT asset_subcategories_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: placed_items placed_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.placed_items
    ADD CONSTRAINT placed_items_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (project_id, user_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_activities_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_created_at ON public.activities USING btree (created_at DESC);


--
-- Name: activities fk_activities_actor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT fk_activities_actor FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: activities fk_activities_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT fk_activities_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: assets fk_asset_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES public.asset_categories(id);


--
-- Name: assets fk_asset_subcategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT fk_asset_subcategory FOREIGN KEY (subcategory_id) REFERENCES public.asset_subcategories(id);


--
-- Name: project_members fk_members_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT fk_members_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_members fk_members_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: placed_items fk_project_items_asset; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.placed_items
    ADD CONSTRAINT fk_project_items_asset FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: placed_items fk_project_items_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.placed_items
    ADD CONSTRAINT fk_project_items_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects fk_projects_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: asset_subcategories fk_subcategory_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_subcategories
    ADD CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES public.asset_categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict eGlZ533s0Ut7M6tI6UGf75c69Cq8EXqM5ZVFV6c6M7Q4BkCluLtim9HzIA5zTJN

