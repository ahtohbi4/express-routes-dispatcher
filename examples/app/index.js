import Router from '../../index';
import routes from './routes';

const router = new Router(routes, {
    baseDir: 'examples/app',
    debug: true,
});

router.start();
