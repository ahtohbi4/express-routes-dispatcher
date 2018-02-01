import Router from '../../index';
import routes from './routes';

const router = new Router(routes, {
    baseDir: 'examples/app',
    publicDir: 'public',
    publicPath: '/static',

    debug: true,
});

router.start();
