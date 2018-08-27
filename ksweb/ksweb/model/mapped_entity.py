from datetime import datetime

from bson import ObjectId
from ming import schema as s
from ming.odm import FieldProperty, ForeignIdProperty, RelationProperty

from ming.odm.declarative import MappedClass
from tg.util import Bunch


class MappedEntity(MappedClass):
    """:type: ming.odm.Mapper"""

    STATUS = Bunch(
        READ="READ",
        UNREAD="UNREAD"
    )

    _id = FieldProperty(s.ObjectId)

    _owner = ForeignIdProperty('User')
    owner = RelationProperty('User')

    _category = ForeignIdProperty('Category')
    category = RelationProperty('Category')

    title = FieldProperty(s.String, required=True)
    public = FieldProperty(s.Bool, if_missing=True)
    visible = FieldProperty(s.Bool, if_missing=True)
    status = FieldProperty(s.OneOf(*STATUS.values()), required=True, if_missing=STATUS.UNREAD)
    auto_generated = FieldProperty(s.Bool, if_missing=False)

    @property
    def created_at(self):
        return self._id.generation_time

    @classmethod
    def unread_count(cls, workspace_id):
        return cls.query.find({'status': cls.STATUS.UNREAD, '_category': ObjectId(workspace_id)}).count() or ''

    @classmethod
    def mark_as_read(cls, user_oid, workspace_id):
        from ming.odm import mapper
        collection = mapper(cls).collection.m.collection
        collection.update_many({'_owner': user_oid, 'status': cls.STATUS.UNREAD, '_category': ObjectId(workspace_id)},
                               update={'$set': {'status': cls.STATUS.READ}})

    def __json__(self):
        from ksweb.lib.utils import to_dict
        _dict = to_dict(self)
        _dict['entity'] = self.entity
        return _dict