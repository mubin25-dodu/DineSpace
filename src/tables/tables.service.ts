import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tables } from './Entity/Tables.entity';
import { In, Repository, Table } from 'typeorm';
import { TableDto } from './Dto/Table.dto';
import { Result } from 'src/SharedServices/Result';
import { ResturantService } from 'src/resturant/resturant.service';
import { ResturantDto } from 'src/resturant/DTO/Resturant.Dto';
import { PartialTableDto } from './Dto/PartialTable.dto';
import { Resturant } from 'src/resturant/Entity/Resturant.entity';
import { TableStatus } from './Enum/tablestatus.enum';

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(Tables) private readonly tablerepo: Repository<Tables>,
        private readonly resturantservice: ResturantService,
    ) {}

    async creatTable(table: TableDto[] , user:any): Promise<Result<Tables[] | ResturantDto >> {
        const result = new Result< ResturantDto|Tables[] >();
        try {
           const checkids = table.some((e)=> e.id !== undefined);
            if(checkids){
                result.Message = "can not provide ids when creating a table";
                result.Success = false;
                return result;
            }

            const tableno = await this.checkdupes(table.map(e=> e.tableno));
            if (tableno != table.length) {
                result.Message = "Duplicate Table found";
                result.Success = false;
                return result;
            }
            const uniqueRestaurantCount = await this.checkdupes(table.map(e=> e.resturantid));
            if (uniqueRestaurantCount > 1) {
                result.Message = "Resturant id can not be ambiguous";
                result.Success = false;
                return result;
            }
            
            //checking ownership

            const checkowner = await this.resturantservice.checkResturantowner(table[0].resturantid , user.userId);
            if(!checkowner.Success){
                result.Message = "you do not have permission to perform this operation";
                result.Success = false ;
                return result;
            }
            //just checking if the ids are present at db or not
            const tables = table.map(t=> t.tableno);

            const exist = await this.tablerepo.find({ where: { resturantid: table[0].resturantid, tableno: In(tables) } })
            if (exist.length > 0) {
                // some ids not found and  rejected
                result.Success = false;
                result.Message = 'One or more Table No already exist';
                return result;
            }

            const create = await this.tablerepo.save(table);
            if (!create) {
                result.Message = "Couldn't create the table";
                result.Success = false;
                return result;
            }

         

            result.Data = create;
            result.Message = 'Restaurant returned successfully';
            return result;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
            return result;
        }
    }
    
    async update(table:PartialTableDto[] , user:any): Promise<Result<ResturantDto | Tables[]>> {
        const result = new Result<Tables[] | Resturant>();
        try {           
            const checkids = table.filter((e)=> e.id === undefined);
            if(checkids.length > 0){
                result.Message = "Provide a valid table id ";
                result.Success = false;
                return result;
            }

            const tableno = await this.checkdupes(table.map(e=> e.tableno));
            if (tableno < table.length) {
                result.Message = "Duplicate Table found";
                result.Success = false;
                return result;
            }
            const isone = await this.checkdupes(table.map(e=> e.resturantid));
            if (isone > 1) {
                result.Message = "Resturant id can not be ambiguous";
                result.Success = false;
                return result;
            }
            const checkowner = await this.resturantservice.checkResturantowner(table[0].resturantid! , user.userId);
            if(!checkowner.Success){
                result.Message = "you do not have permission to perform this operation";
                result.Success = false ;
                return result;
            }

            //just checking if the ids are present at db or not
            const ids = table.map(t=> t.id);

            const exist = await this.tablerepo.find({where:{id: In(ids)}})
            if (exist.length !== ids.length) {
                // some ids not found and  rejected
                result.Success = false;
                result.Message = 'One or more table ids do not exist';
                return result;
            }

            const create = await this.tablerepo.save(table);
            result.Data = create;
            result.Message = 'Restaurant returned successfully';
            return result;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
            return result;
        }
    }

    async deletetable(id:string , user:any): Promise<Result<Resturant>> {
        const result = new Result<Resturant>();
        try {
            const getresturant = await this.tablerepo.findOne({ where: { id:id } });
            if (!getresturant) {
                result.Message = "table not found";
                result.Success = false;
                return result;
            }
            const isowner = await this.resturantservice.checkResturantowner(getresturant.resturantid, user.userId);
            if (!isowner.Success) {
                result.Message = "Not a valid owner of this resturant";
                result.Success = false;
                return result;
            }
            await this.tablerepo.delete(id);
            result.Data = isowner.Data;
            result.Message = 'Table deleted successfully';
            result.Success = true;
            return result;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
            result.Data = undefined;
            return result;
        }
    }

    async tableStatus(id:string , user:any , status:TableStatus):Promise<Result<Tables>> {
        const result = new Result<Tables>();
        try {
            const getresturant = await this.tablerepo.findOne({ where: { id:id } });
            if (!getresturant) {
                result.Message = "table not found";
                result.Success = false;
                return result;
            }
            const isowner = await this.resturantservice.checkResturantowner(getresturant.resturantid, user.userId);
            if (!isowner.Success) {
                result.Message = "Not a valid owner of this resturant";
                result.Success = false;
                return result;
            }
           
            getresturant.status = status;
            result.Data =  await this.tablerepo.save(getresturant);
            result.Message = 'Table ststus Updated successfully';
            result.Success = true;
            return result;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
            result.Data = undefined;
            return result;
        }
    }
    
    async gettable(id:string ):Promise<Result<Tables[]>> {
        const result = new Result<Tables[]>();
        try {
            const gettable = await this.tablerepo.find({ where: { resturantid:id } });
        
            result.Data =  gettable;
            result.Message = `${gettable.length} Tables Found `;
            result.Success = true;
            return result;
        } catch (e) {
            result.Message = String(e);
            result.Success = false;
            result.Data = undefined;
            return result;
        }
    }

    async checkdupes(data:any[]):Promise<number>{
        const length = new Set(data).size;
        return length;
    }
}
